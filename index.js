document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const keyDisplay = document.getElementById('keyDisplay');
    const fretboardCanvas = document.getElementById('fretboardCanvas');
    
    const majorCheckbox = document.getElementById('major');
    const minorCheckbox = document.getElementById('minor');
    const pentatonicMajorCheckbox = document.getElementById('pentatonicMajor');
    const pentatonicMinorCheckbox = document.getElementById('pentatonicMinor');
    const bluesCheckbox = document.getElementById('blues');
    const diminishedCheckbox = document.getElementById('diminished');
    
    const keyData = generateKeys();
    
    const ctx = fretboardCanvas.getContext('2d');
    
    const guitarTuning = ['E', 'A', 'D', 'G', 'B', 'E'];
    
    const fretboardConfig = {
        stringCount: 6,
        fretCount: 12,
        stringSpacing: 30,
        fretSpacing: 50,
        dotRadius: 10,
        stringColor: '#333',
        fretColor: '#555',
        rootNoteColor: '#FF5733',
        scaleNoteColor: '#33A1FF',
        markerPositions: [3, 5, 7, 9, 12]
    };
    
    generateBtn.addEventListener('click', function() {
        generateRandomKey();
    });
    
    function generateKeys() {
        const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const useFlats = {
            'F': true, 'Bb': true, 'Eb': true, 'Ab': true, 'Db': true, 'Gb': true, 'Cb': true, 
            'D': true, 'G': true, 'C': true
        };
        const sharpToFlat = {
            'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
        };
        const flatToSharp = {
            'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
        };
        const keyDatabase = {
            sharp: { major: [], minor: [], pentatonicMajor: [], pentatonicMinor: [], blues: [], diminished: [] },
            flat: { major: [], minor: [], pentatonicMajor: [], pentatonicMinor: [], blues: [], diminished: [] },
            all: { major: [], minor: [], pentatonicMajor: [], pentatonicMinor: [], blues: [], diminished: [] },
            keyNotes: {}
        };
        
        const stepPatterns = {
            'major': [2, 2, 1, 2, 2, 2, 1],
            'minor': [2, 1, 2, 2, 1, 2, 2],
            'pentatonicMajor': [2, 2, 3, 2, 3],
            'pentatonicMinor': [3, 2, 2, 3, 2],
            'blues': [3, 2, 1, 1, 3, 2],
            'diminished': [2, 1, 2, 1, 2, 1, 2, 1]
        };
        
        chromaticScale.forEach(rootNote => {
            const useFlatNotation = rootNote in useFlats;
            const notation = useFlatNotation ? 'flat' : 'sharp';
            let properRootName = rootNote;
            
            if (useFlatNotation && rootNote in sharpToFlat) {
                properRootName = sharpToFlat[rootNote];
            } else if (!useFlatNotation && rootNote in flatToSharp) {
                properRootName = flatToSharp[rootNote];
            }
            
            Object.keys(stepPatterns).forEach(scaleType => {
                let scaleName;
                if (scaleType === 'pentatonicMajor') {
                    scaleName = `${properRootName} major pentatonic`;
                } else if (scaleType === 'pentatonicMinor') {
                    scaleName = `${properRootName} minor pentatonic`;
                } else if (scaleType === 'blues') {
                    scaleName = `${properRootName} blues`;
                } else if (scaleType === 'diminished') {
                    scaleName = `${properRootName} diminished`;
                } else {
                    scaleName = `${properRootName} ${scaleType}`;
                }
                
                const scaleNotes = getNotesInKey(rootNote, scaleType, notation, stepPatterns);
                
                keyDatabase[notation][scaleType].push(scaleName);
                keyDatabase.all[scaleType].push(scaleName);
                keyDatabase.keyNotes[scaleName] = scaleNotes;
            });
        });
        
        return keyDatabase;
    }

    function getNotesInKey(rootNote, scaleType, notation, stepPatterns) {
        const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const rootIndex = chromaticScale.indexOf(rootNote);
        const pattern = stepPatterns[scaleType];
        
        const notes = [rootNote];
        let currentIndex = rootIndex;
        
        const steps = scaleType === 'diminished' ? pattern.length : pattern.length - 1;
        
        for (let i = 0; i < steps; i++) {
            currentIndex = (currentIndex + pattern[i]) % 12;
            notes.push(chromaticScale[currentIndex]);
        }
        
        const formattedNotes = notes.map(note => formatNote(note, notation));
        return formattedNotes;
    }

    function formatNote(note, notation) {
        const sharpToFlat = {
            'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
        };
        
        const flatToSharp = {
            'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#'
        };
        
        if (notation === 'flat' && note in sharpToFlat) {
            return sharpToFlat[note];
        } else if (notation === 'sharp' && note in flatToSharp) {
            return flatToSharp[note];
        }
        
        return note;
    }
    
    function standardizeNoteName(note) {
        const flatToSharp = {
            'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
            'Fb': 'E', 'Cb': 'B'
        };
        
        if (note in flatToSharp) {
            return flatToSharp[note];
        }
        
        return note;
    }
    
    function drawFretboard() {
        const { stringCount, fretCount, stringSpacing, fretSpacing, stringColor, fretColor, markerPositions } = fretboardConfig;
        
        ctx.clearRect(0, 0, fretboardCanvas.width, fretboardCanvas.height);
        
        ctx.fillStyle = '#E5E0C4';
        ctx.fillRect(0, 0, fretboardCanvas.width, fretboardCanvas.height);
        
        const xOffset = 40;
        const yOffset = 20;
        
        ctx.strokeStyle = stringColor;
        for (let i = 0; i < stringCount; i++) {
            ctx.beginPath();
            ctx.lineWidth = 1 + (stringCount - i) * 0.5;
            ctx.moveTo(xOffset, yOffset + i * stringSpacing);
            ctx.lineTo(xOffset + fretCount * fretSpacing, yOffset + i * stringSpacing);
            ctx.stroke();
        }
        
        ctx.strokeStyle = fretColor;
        ctx.lineWidth = 2;
        for (let i = 0; i <= fretCount; i++) {
            ctx.beginPath();
            ctx.moveTo(xOffset + i * fretSpacing, yOffset);
            ctx.lineTo(xOffset + i * fretSpacing, yOffset + (stringCount - 1) * stringSpacing);
            ctx.stroke();
        }
        
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(xOffset, yOffset);
        ctx.lineTo(xOffset, yOffset + (stringCount - 1) * stringSpacing);
        ctx.stroke();
        
        ctx.fillStyle = '#888';
        for (let fret of markerPositions) {
            if (fret <= fretCount) {
                const markerX = xOffset + (fret - 0.5) * fretSpacing;
                if (fret === 12) {
                    ctx.beginPath();
                    ctx.arc(markerX, yOffset + 1 * stringSpacing, 5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.arc(markerX, yOffset + 4 * stringSpacing, 5, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.beginPath();
                    ctx.arc(markerX, yOffset + 2.5 * stringSpacing, 5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        for (let i = 1; i <= fretCount; i++) {
            ctx.fillText(i.toString(), xOffset + (i - 0.5) * fretSpacing, yOffset + stringCount * stringSpacing + 15);
        }
        
        ctx.textAlign = 'right';
        for (let i = 0; i < stringCount; i++) {
            ctx.fillText(guitarTuning[i], xOffset - 10, yOffset + i * stringSpacing + 4);
        }
    }
    
    function highlightScaleNotes(scaleNotes, rootNote) {
        const { stringCount, fretCount, stringSpacing, fretSpacing, dotRadius, rootNoteColor, scaleNoteColor } = fretboardConfig;
        
        const standardizedRoot = standardizeNoteName(rootNote);
        const standardizedScaleNotes = scaleNotes.map(standardizeNoteName);
        
        const tuningNotes = guitarTuning.map(standardizeNoteName);
        
        const chromaticScale = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        
        const xOffset = 40;
        const yOffset = 20;
        
        for (let stringIndex = 0; stringIndex < stringCount; stringIndex++) {
            const openNote = tuningNotes[stringIndex];
            const openNoteIndex = chromaticScale.indexOf(openNote);
            
            for (let fret = 0; fret <= fretCount; fret++) {
                const noteIndex = (openNoteIndex + fret) % 12;
                const note = chromaticScale[noteIndex];
                
                if (standardizedScaleNotes.includes(note)) {
                    const noteX = xOffset + (fret === 0 ? 0.5 * fretSpacing : (fret - 0.5) * fretSpacing);
                    const noteY = yOffset + stringIndex * stringSpacing;
                    
                    ctx.beginPath();
                    ctx.arc(noteX, noteY, dotRadius, 0, Math.PI * 2);
                    
                    if (note === standardizedRoot) {
                        ctx.fillStyle = rootNoteColor;
                    } else {
                        ctx.fillStyle = scaleNoteColor;
                    }
                    
                    ctx.fill();
                    
                    ctx.fillStyle = 'white';
                    ctx.font = '10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(note, noteX, noteY + 3);
                }
            }
        }
    }

    function generateRandomKey() {
        const includeMajor = majorCheckbox.checked;
        const includeMinor = minorCheckbox.checked;
        const includePentatonicMajor = pentatonicMajorCheckbox.checked;
        const includePentatonicMinor = pentatonicMinorCheckbox.checked;
        const includeBlues = bluesCheckbox.checked;
        const includeDiminished = diminishedCheckbox.checked;
        
        const includeSharps = true;
        const includeFlats = true;
        
        let availableKeys = [];
        
        if (includeSharps || includeFlats) {
            const notations = [];
            if (includeSharps) notations.push('sharp');
            if (includeFlats) notations.push('flat');
            
            notations.forEach(notation => {
                if (includeMajor) availableKeys = availableKeys.concat(keyData[notation].major);
                if (includeMinor) availableKeys = availableKeys.concat(keyData[notation].minor);
                if (includePentatonicMajor) availableKeys = availableKeys.concat(keyData[notation].pentatonicMajor);
                if (includePentatonicMinor) availableKeys = availableKeys.concat(keyData[notation].pentatonicMinor);
                if (includeBlues) availableKeys = availableKeys.concat(keyData[notation].blues);
                if (includeDiminished) availableKeys = availableKeys.concat(keyData[notation].diminished);
            });
        }
        
        if (availableKeys.length === 0) {
            keyDisplay.textContent = 'Please select at least one scale type';
            return;
        }
        
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        const selectedKey = availableKeys[randomIndex];
        
        if (keyData.keyNotes[selectedKey]) {
            const notesText = 'Notes: ' + keyData.keyNotes[selectedKey].join(', ');
            keyDisplay.innerHTML = `<div>${selectedKey}</div><div style="font-size: 1.2rem; margin-top: 15px">${notesText}</div>`;
            
            drawFretboard();
            
            const rootNote = selectedKey.split(' ')[0];
            highlightScaleNotes(keyData.keyNotes[selectedKey], rootNote);
        } else {
            keyDisplay.textContent = selectedKey;
        }
    }
    
    drawFretboard();
});