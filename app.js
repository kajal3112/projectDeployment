

class Editor {
    constructor() {
        // Initializes the editor instance, sets the editor element, and password for encryption
        this.editor = document.getElementById("editor");
        this.glossary = {
            "JavaScript": "A programming language used for web development.",
            "Encryption": "The process of converting information into a secure format.",
            "API": "A set of functions and protocols for building software applications.",
            "HTML": "The standard markup language for creating web pages.",
            "CSS": "A stylesheet language used to style web pages."
        };
        this.bindEvents();

    }

    
    bindEvents(){
        // Binds various event handlers 
        this.initializeTextFormatting();
        this.initializeTextAlignment();
        this.clearEditorContent();
        this.initializeSaveNote();
        this.initializeFontSizeChange();
        this.initializeGlossaryHighlighting();
    }

    initializeTextFormatting(){
         // Attaches click event listeners to formatting buttons (Bold, Italic, Underline) to toggle styles.
        let formatButtons = document.querySelectorAll('.formatText');
        
        formatButtons.forEach((e) => {
            e.addEventListener('click', () => {
                console.log('hello');
                const formattingType = e.innerText.toLowerCase();
                this.applyTextFormatting(formattingType);
            });
        })
    }

    applyTextFormatting(formattingType){
        // Toggles the selected text formatting (bold, italic, underline) on the editor.
        if(formattingType === "bold"){
            this.editor.classList.toggle("bold");
        } else if (formattingType === "italic") {
            this.editor.classList.toggle("italic");
        } else if (formattingType === "underline") {
            this.editor.classList.toggle("underline");
        }
    }

    initializeTextAlignment() {
        // Attaches click event listeners to alignment buttons (Left, Right, Center) to adjust text alignment.
        let alignmentButtons = document.querySelectorAll('.textAlign');
    
        alignmentButtons.forEach((e) => {
            e.addEventListener('click', () => {
                console.log('hello');
                const alignmentType = e.innerText.toLowerCase();
                this.applyTextAlignment(alignmentType);
            });
        })
      }

      applyTextAlignment(alignmentType) {
        // Removes existing alignment classes and applies the selected alignment to the editor.
        this.editor.classList.remove("left", "right", "center");

        // Add the selected alignment class
        if (alignmentType === "left") {
            this.editor.classList.add("left");
        } else if (alignmentType === "right") {
            this.editor.classList.add("right");
        } else if (alignmentType === "center") {
            this.editor.classList.add("center");
        }
      }

      // font size set function
      initializeFontSizeChange() {
        let fontSizeWrapper = document.querySelector('.font-size-dropdown');
        let fontSizeDropdown = document.getElementById('fontDropdownMenu');

        fontSizeWrapper.addEventListener('click', () => {
            fontSizeDropdown.classList.toggle('hide');
        })
        
        let fontSizeOptions = document.querySelectorAll('ul.font-size-options li');
            
        fontSizeOptions.forEach((e) => {
            e.addEventListener('click', () => {
                console.log('hello');
                const fontSize = e.innerText.toLowerCase();
                this.applyFontSize(fontSize);
            });
        })
    }
    

    // apply font size as per user selection
    applyFontSize(fontSize){
        this.editor.classList.remove("small", "medium", "large");
        if(fontSize === "small"){
            this.editor.classList.toggle("small");
        } else if (fontSize === "normal") {
            this.editor.classList.toggle("medium");
        } else if (fontSize === "large") {
            this.editor.classList.toggle("large");
        }
    }

    //clear the content of editor
    clearEditorContent() {
        let clearEdit = document.getElementById('ClearEditor');
        clearEdit.addEventListener('click', () => {
            this.editor.innerHTML = "";
        })
    }

    // intialise the save note
    initializeSaveNote(){
        let saveButton = document.getElementById('Savebutton');
        saveButton.addEventListener('click', () => {
            this.saveNote();
        })
    }

    saveNote() {
        let notes = JSON.parse(localStorage.getItem('notes')) || [];
        let editingNoteId = null;
        const content = this.editor.innerHTML.trim();
      
        if (content === '') {
          alert('Note cannot be empty!');
          return;
        }

        const password = prompt('Enter a password to secure this note:');
        if (!password) {
            alert('Password is required to save the note.');
            return;
        }
        else {
            const encryptedContent = this.encrypt(content, password).toString(); // Encrypt the content
            const note = { id: Date.now(), content: encryptedContent };
            notes.push(note);

            localStorage.setItem("notes", JSON.stringify(notes));
            this.editor.innerHTML = "";
            alert("Note saved!");
        }
      }

      // Render notes in the list
        renderNotes() {
            // this.fetchExistNotes();
            let notes = JSON.parse(localStorage.getItem('notes')) || [];
            let editingNoteId = null;
            let notesList = document.getElementById('notesList');
            notesList.innerHTML = '';
        
            if (notes.length === 0) {
            notesList.innerHTML = '<p>No notes available.</p>';
            return;
            }
            notes.forEach(note => {
                const password = prompt('Enter the password to decrypt the note:');
                const decryptedContent = this.decrypt(note.content, password);

                if (decryptedContent) {
                    const noteItem = document.createElement('div');
                    noteItem.className = 'note-item';
                    noteItem.innerHTML = `
                        <span>${decryptedContent.substring(0, 30)}...</span>
                        <div>
                            <button onclick="editorInstance.editNote(${note.id})">Edit</button>
                            <button onclick="editorInstance.deleteNote(${note.id})">Delete</button>
                        </div>
                    `;
                    notesList.appendChild(noteItem);
                } else {
                    alert('Failed to decrypt note. Incorrect password.');
                }
            });
        }
  
    // Edit note function
        editNote(id) {
            let notes = JSON.parse(localStorage.getItem("notes")) || [];
            const note = notes.find(note => note.id === id);
            // let editingNoteId = id;
            if (note) {
                const password = prompt('Enter the password to decrypt the note:');
                const decryptedContent = this.decrypt(note.content, password); // Decrypt the content
                if (decryptedContent) {
                    // Show the decrypted content
                    this.showDecryptedNoteContent(decryptedContent);
                } else {
                    // Notify the user if decryption failed
                    alert('Failed to decrypt note. Incorrect password.');
                }
            }
        }

        // Function to display the decrypted note content
        showDecryptedNoteContent(content) {
            // You can customize this as per your requirements, for example displaying it in a modal or a div
            const editor = this.editor;
            editor.innerHTML = content;
        }
    
    // Delete note function
        deleteNote(id) {
            let notes = JSON.parse(localStorage.getItem("notes")) || [];
            notes = notes.filter(note => note.id !== id);
            localStorage.setItem('notes', JSON.stringify(notes));
            this.renderNotes();
        }

    encrypt(content, password) {
        return CryptoJS.AES.encrypt(content, password).toString();
      }
      
    decrypt(encryptedContent, password) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
            return bytes.toString(CryptoJS.enc.Utf8); // Converts to readable text
        } catch (error) {
            console.error("Decryption failed:", error);
            return null;
        }
    }
      
    // Auto Glossary Highlighting
    initializeGlossaryHighlighting() {
        const editor = this.editor;

        // Trigger glossary highlighting when typing stops
        editor.addEventListener('input', () => {
            clearTimeout(this.typingTimer);
            this.typingTimer = setTimeout(() => {
                this.highlightGlossaryTerms();
            }, 500); // Delay to avoid excessive processing
        });
    }

    highlightGlossaryTerms() {
        const editor = this.editor;
        const content = editor.innerHTML;
        const terms = Object.keys(this.glossary);

        let updatedContent = content;
        terms.forEach(term => {
            const regex = new RegExp(`\\b${term}\\b`, 'g');
            updatedContent = updatedContent.replace(
                regex,
                `<span class="highlight" data-tooltip="${this.glossary[term]}">${term}</span>`
            );
        });

        editor.innerHTML = updatedContent;
        this.attachTooltipEvents();
    }

    attachTooltipEvents() {
        // Attach hover events to display tooltips
        const highlights = document.querySelectorAll('.highlight');
        highlights.forEach(span => {
            span.addEventListener('mouseover', (e) => {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = span.getAttribute('data-tooltip');
                document.body.appendChild(tooltip);

                // Position tooltip
                const rect = span.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY}px`;

                span.addEventListener('mouseout', () => {
                    tooltip.remove();
                });
            });
        });
    }

}





document.addEventListener("DOMContentLoaded", () => {
    window.editorInstance = new Editor();
    editorInstance.renderNotes();
});
