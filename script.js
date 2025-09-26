document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '/index1.html';
        return;
    }

    // Update UI with user info
    const userName = document.getElementById('userName');
    userName.textContent = `Welcome, ${user.name}!`;

    // Logout handler
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    });

    const originalText = document.getElementById('original');
    const resultText = document.getElementById('result');
    const paraphraseBtn = document.getElementById('paraphrase');
    const copyBtn = document.getElementById('copy');
    const styleSelect = document.getElementById('style');
    const wordCountElement = document.getElementById('wordCount');

    // Update word count
    function updateWordCount() {
        const text = originalText.value.trim();
        const wordCount = text ? text.split(/\s+/).length : 0;
        wordCountElement.textContent = wordCount;
    }

    originalText.addEventListener('input', updateWordCount);

    // Advanced paraphrasing logic
    const synonyms = {
        professional: {
            'very': ['significantly', 'substantially', 'considerably'],
            'good': ['excellent', 'exceptional', 'outstanding'],
            'bad': ['unfavorable', 'inadequate', 'suboptimal'],
            'big': ['substantial', 'significant', 'considerable'],
            'small': ['minimal', 'limited', 'modest'],
            'important': ['crucial', 'essential', 'critical'],
            'problem': ['challenge', 'issue', 'concern'],
            'make': ['develop', 'create', 'establish'],
            'use': ['utilize', 'implement', 'employ'],
            'help': ['assist', 'support', 'facilitate']
        },
        casual: {
            'approximately': ['about', 'around', 'roughly'],
            'require': ['need', 'want', 'gotta have'],
            'obtain': ['get', 'grab', 'pick up'],
            'purchase': ['buy', 'get', 'pick up'],
            'sufficient': ['enough', 'plenty', 'lots'],
            'assist': ['help', 'give a hand', 'pitch in'],
            'utilize': ['use', 'work with', 'try'],
            'implement': ['do', 'put in place', 'start using'],
            'facilitate': ['help', 'make easier', 'smooth out']
        },
        formal: {
            'get': ['obtain', 'acquire', 'procure'],
            'use': ['utilize', 'employ', 'implement'],
            'start': ['commence', 'initiate', 'begin'],
            'end': ['conclude', 'terminate', 'finalize'],
            'show': ['demonstrate', 'illustrate', 'indicate'],
            'help': ['facilitate', 'assist', 'aid'],
            'make': ['construct', 'fabricate', 'produce'],
            'tell': ['inform', 'advise', 'notify'],
            'find': ['discover', 'ascertain', 'determine']
        },
        simple: {
            'utilize': ['use', 'work with', 'try'],
            'implement': ['use', 'start', 'begin'],
            'facilitate': ['help', 'aid', 'support'],
            'commence': ['start', 'begin', 'get going'],
            'terminate': ['end', 'stop', 'finish'],
            'demonstrate': ['show', 'prove', 'display'],
            'acquire': ['get', 'buy', 'receive'],
            'proceed': ['go', 'move', 'continue'],
            'sufficient': ['enough', 'plenty', 'adequate']
        }
    };

    function getRandomSynonym(word, style) {
        const styleDict = synonyms[style];
        if (styleDict && styleDict[word.toLowerCase()]) {
            const synonymList = styleDict[word.toLowerCase()];
            return synonymList[Math.floor(Math.random() * synonymList.length)];
        }
        return word;
    }

    function restructureSentence(sentence) {
        // Remove leading/trailing spaces and convert to lowercase for processing
        sentence = sentence.trim();
        
        // Different sentence structure patterns
        const patterns = [
            (s) => `In terms of ${s.toLowerCase()}`,
            (s) => `Regarding ${s.toLowerCase()}`,
            (s) => `As for ${s.toLowerCase()}`,
            (s) => s, // Sometimes keep the original structure
            (s) => {
                const words = s.split(' ');
                if (words.length > 3) {
                    const midPoint = Math.floor(words.length / 2);
                    return [...words.slice(midPoint), ', ', ...words.slice(125, midPoint)].join(' ');
                }
                return s;
            }
        ];

        // Randomly select a pattern
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        return pattern(sentence);
    }

    function paraphraseText(text, style) {
        if (!text.trim()) return '';

        // Split into sentences
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        return sentences.map(sentence => {
            // Split sentence into words
            const words = sentence.split(/\s+/);
            
            // Paraphrase each word if it has a synonym
            const paraphrasedWords = words.map(word => {
                // Preserve capitalization
                const isCapitalized = word[0] === word[0].toUpperCase();
                const synonym = getRandomSynonym(word, style);
                return isCapitalized ? 
                    synonym.charAt(0).toUpperCase() + synonym.slice(1) : 
                    synonym;
            });

            // Randomly restructure some sentences
            let paraphrasedSentence = paraphrasedWords.join(' ');
            if (Math.random() > 0.5) {
                paraphrasedSentence = restructureSentence(paraphrasedSentence);
            }

            return paraphrasedSentence;
        }).join(' ');
    }

    paraphraseBtn.addEventListener('click', () => {
        const text = originalText.value.trim();
        if (!text) {
            alert('Please enter some text to paraphrase');
            return;
        }

        // Add loading state
        paraphraseBtn.disabled = true;
        paraphraseBtn.classList.add('loading');
        paraphraseBtn.textContent = 'Paraphrasing...';

        // Simulate processing time
        setTimeout(() => {
            const style = styleSelect.value;
            const paraphrased = paraphraseText(text, style);
            resultText.value = paraphrased;

            // Remove loading state
            paraphraseBtn.disabled = false;
            paraphraseBtn.classList.remove('loading');
            paraphraseBtn.textContent = 'Paraphrase';
        }, 1000);
    });

    copyBtn.addEventListener('click', () => {
        if (!resultText.value) {
            alert('No text to copy!');
            return;
        }

        navigator.clipboard.writeText(resultText.value)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text:', err);
                alert('Failed to copy text to clipboard');
            });
    });
});