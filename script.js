const strings = [
    {
        "name": "violin",
        "clef": "treble",
        "open": [4, 9, 2, 7],
        "openstaff": [7, 3, -1, -5],
        "total": 17,
        "width": 6,
        "positions":{
            "1st": 2,
            "2nd": 3,
            "3rd": 5,
            "4th": 7,
            "1/2th": 1,
        }
    }
]

// "num":   [0,      1,     2,     3,    4,   5,     6,     7,     8,     9,     10,   11],
// "scale": ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"],

const scale = ["C", "C♯/D♭", "D", "D♯/E♭", "E", "F", "F♯/G♭", "G", "G♯/A♭", "A", "A♯/B♭", "B"];
let current = {};

document.addEventListener("DOMContentLoaded", () => {
    // Find JSON
    const selected = "violin";

    for(let i=0;i<strings.length; i++){
        if(strings[i].name == selected)
            current = strings[i];
    }

    // Setup dropdown
    const dropdown = document.getElementById("position-dropdown");
    let keys = Object.keys(current.positions);
    for(let i=0;i<keys.length;i++){
        const option = document.createElement("option");
        option.value = keys[i];
        option.text = keys[i] + " position";
        dropdown.appendChild(option)
    }

    refresh();
});


function refresh(){
    const dropdown = document.getElementById("position-dropdown");
    const pos = dropdown.value;

    // Grid setup
    const gridContainer = document.querySelector(".pitch-container");
    gridContainer.innerHTML = "";

    // Music staff setup
    const musicStaffsContainer = document.querySelector(".music-staffs");
    musicStaffsContainer.innerHTML = "";

    // Go through all notes
    for(let r = 0; r < current.open.length; r++){
        const row = document.createElement("div");
        row.classList.add("pitch-row");

        const staff = document.createElement("div");
        staff.classList.add("staff");
        musicStaffsContainer.appendChild(staff);

        const clef = document.createElement("div");
        clef.classList.add(current.clef);
        staff.appendChild(clef);

        for(let i=0;i<5;i++){
            const line = document.createElement("div");
            line.classList.add("staff-line");
            line.style.bottom = `${i*8}px`
            staff.appendChild(line);
        }
        const bar = document.createElement("div");
        bar.classList.add("bar");
        staff.appendChild(bar);


        let count = 0;
        let offset = 0;

        for (let c = 0; c < current.total; c++) {
            const index = (current.open[r] + c)%12

            const item = document.createElement("div");
            item.classList.add("pitch-button");
            item.innerHTML = scale[index].replace("/", "<br>&nbsp&nbsp&nbsp&nbsp")
                                                        .replace("♯", "<sup>♯</sup>")
                                                        .replace("♭", "<sup>♭</sup>");

            if(c != 0 && c < current.positions[pos] || c >= current.positions[pos]+current.width)
                item.classList.add("hide")
            else{
                // Add note to staff
                const note = document.createElement("div");
                note.classList.add("note");

                // Create note names
                const noteName = document.createElement("div");
                noteName.classList.add("note-name");
                noteName.innerHTML = scale[index]
                                     .replace("♯", "<sup>♯</sup>")
                                     .replace("♭", "<sup>♭</sup>");

                let hasSharp = false;
                // Sharp and flats
                if(scale[index].includes("/")){
                    hasSharp = true
                    note.classList.add("sharp");
                    note.textContent = "♯"
                    offset++;
                    
                    note.style.left = `${(count / (current.width+1)) * 90 + 10}%`;

                    const note2 = document.createElement("div");
                    note2.classList.add("note");
                    note2.classList.add("sharp");
                    note2.textContent = "♭"
                    note2.style.left = "24px";
                    note2.style.bottom = "4px"    
                    note.appendChild(note2);

                    noteName.style.left = "18px"
                }

                // Positioning
                let y = current.openstaff[r]+c-offset
                note.style.left = `${(count / (current.width+1)) * 90 + 12}%`;
                note.style.bottom = `${y*4-4}px`

                noteName.innerHTML = y + noteName.innerHTML

                // Create ledger bars - lower
                for(let i=y-y%2;i<0;i+=2){
                    const ledger = document.createElement("div");
                    ledger.classList.add("ledger");
                    ledger.style.left = `${note.style.left.replace("%","")-0.5}%`;
                    ledger.style.bottom = `${i*4}px`
                    staff.appendChild(ledger);

                    if(hasSharp){
                        if(y%2==0 && i==y-y%2){
                            console.log(noteName.innerHTML)
                            continue;
                        }

                        const ledger2 = document.createElement("div");
                        ledger2.classList.add("ledger");
                        ledger2.style.left = `${note.style.left.replace("%","")-(-3.39)}%`;
                        ledger2.style.bottom = `${i*4}px`
                        staff.appendChild(ledger2);
                    }
                }

                // Create ledger bars - higher
                for(let i=y-y%2;i>8;i-=2){
                    const ledger = document.createElement("div");
                    ledger.classList.add("ledger");
                    ledger.style.left = `${note.style.left.replace("%","")-0.46}%`;
                    ledger.style.bottom = `${i*4}px`
                    staff.appendChild(ledger);

                    if(hasSharp){
                        const ledger2 = document.createElement("div");
                        ledger2.classList.add("ledger");
                        ledger2.style.left = `${note.style.left.replace("%","")-(-3.39)}%`;
                        ledger2.style.bottom = `${i*4}px`
                        staff.appendChild(ledger2);
                    }
                }
                if(hasSharp && y>0 && y%2==1){
                    const ledger2 = document.createElement("div");
                    ledger2.classList.add("ledger");
                    ledger2.style.left = `${note.style.left.replace("%","")-(-3.39)}%`;
                    ledger2.style.bottom = `${(y+1)*4}px`
                    staff.appendChild(ledger2);
                }

                // Mouse over listeners
                note.addEventListener("mouseover", () => {
                    note.classList.add("focused");
                    item.classList.add("focused");
                });
                note.addEventListener("mouseout", () => {
                    note.classList.remove("focused");
                    item.classList.remove("focused");
                });
                item.addEventListener("mouseover", () => {
                    note.classList.add("focused");
                    item.classList.add("focused");
                });
                item.addEventListener("mouseout", () => {
                    note.classList.remove("focused");
                    item.classList.remove("focused");
                });
    
                note.appendChild(noteName);
                staff.appendChild(note);
                count++;
            }

            if(scale[index].includes("/"))
                item.classList.add("double");
                
            row.appendChild(item);
        }

        gridContainer.appendChild(row);
    }

    // Toggle annotations
    const toggle = document.getElementById("toggle-annotations");
    toggle.addEventListener("change", () => {
        const notes = document.querySelectorAll(".note");
        notes.forEach(note => {
            if (toggle.checked) {
                note.classList.add("show-name");
            } else {
                note.classList.remove("show-name");
            }
        });
    });
}






function refreshStaff(){
    const dropdown = document.getElementById("position-dropdown");
    const pos = dropdown.value;

    // Music staff setup
    const musicStaffsContainer = document.querySelector(".music-staffs");
    for (let r = 0; r < current.open.length; r++) {
        const staff = document.createElement("div");
        staff.classList.add("staff");
        musicStaffsContainer.appendChild(staff);

        // Adding notes
        for (let c = 0; c < current.width; c++) {
            const note = document.createElement("div");
            note.classList.add("note");
            note.style.left = `${(c / current.width) * 90 + 12}%`;
            note.addEventListener("mouseover", () => note.classList.add("show-name"));
            note.addEventListener("mouseout", () => note.classList.remove("show-name"));

            const noteName = document.createElement("div");
            noteName.classList.add("note-name");
            noteName.innerHTML = scale[(current.open[r] + current.positions[pos] + c)%12].replace("♯", "<sup>♯</sup>")
            .replace("♭", "<sup>♭</sup>");
            note.appendChild(noteName);

            staff.appendChild(note);
        }
    }

    // Toggle annotations
    const toggle = document.getElementById("toggle-annotations");
    toggle.addEventListener("change", () => {
        const notes = document.querySelectorAll(".note");
        notes.forEach(note => {
            if (toggle.checked) {
                note.classList.add("show-name");
            } else {
                note.classList.remove("show-name");
            }
        });
    });
}