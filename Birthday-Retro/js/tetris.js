// File: js/tetris.js (Versi Final Lengkap - Cek Ulang)

document.addEventListener('DOMContentLoaded', () => {

    // --- Dapatkan Elemen DOM ---
    const canvas = document.getElementById('tetris-board');
    const scoreElement = document.getElementById('score');
    const linesElement = document.getElementById('lines');
    const levelElement = document.getElementById('level');
    const startButton = document.getElementById('btn-start-game');
    const leftButton = document.getElementById('btn-left');
    const rightButton = document.getElementById('btn-right');
    const rotateButton = document.getElementById('btn-rotate');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const ingetYaOverlay = document.getElementById('inget-ya-overlay');
    const confirmGameOverButton = document.getElementById('btn-confirm-gameover');
    const okIngetYaButton = document.getElementById('btn-ok-ingetya');

    // --- Periksa Elemen ---
    if (!canvas || !canvas.getContext) { console.error("Canvas error."); return; }
    // Lakukan pengecekan lebih lengkap
    const uiElements = { scoreElement, linesElement, levelElement, startButton, leftButton, rightButton, rotateButton, gameOverOverlay, ingetYaOverlay, confirmGameOverButton, okIngetYaButton };
    for(const key in uiElements) {
        if (!uiElements[key]) {
            console.error(`UI element error: ${key} not found. Check ID in HTML.`);
            return; // Hentikan jika ada elemen penting yg hilang
        }
    }

    const ctx = canvas.getContext('2d');

    // === KONFIGURASI GAME ===
    const COLS = 16;
    const ROWS = 16;
    const BLOCK_SIZE = 18;
    const EMPTY_COLOR = '#000';

    // === PALET WARNA ASLI ===
    const COLORS = [ null, '#00ffff', '#0000ff', '#ff7f00', '#ffff00', '#00ff00', '#800080', '#ff0000' ];
    const SHAPES = [ [[0,0,0,0], [1,1,1,1], [0,0,0,0], [0,0,0,0]], [[1,0,0], [1,1,1], [0,0,0]], [[0,0,1], [1,1,1], [0,0,0]], [[1,1], [1,1]], [[0,1,1], [1,1,0], [0,0,0]], [[0,1,0], [1,1,1], [0,0,0]], [[1,1,0], [0,1,1], [0,0,0]] ];

    // --- State Game ---
    let board = []; let score = 0; let lines = 0; let level = 1;
    let gameOver = false; let paused = false; let currentPiece;
    let requestId; let lastTime = 0; let dropCounter = 0; let dropInterval;

    // --- Fungsi Menggambar ---
    function drawSquare(x, y, colorIndex) { try { ctx.fillStyle = COLORS[colorIndex] || EMPTY_COLOR; ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE); ctx.strokeStyle = 'rgba(50, 50, 50, 0.5)'; ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE); } catch (e) { console.error("Error drawing square:", e); } }
    function drawBoard() { try { ctx.fillStyle = EMPTY_COLOR; ctx.fillRect(0, 0, canvas.width, canvas.height); for (let r = 0; r < ROWS; r++) { for (let c = 0; c < COLS; c++) { if (board[r] && board[r][c]) { drawSquare(c, r, board[r][c]); } } } } catch (e) { console.error("Error drawing board:", e); } }
    function drawPiece(piece) { try { if (!piece) return; piece.shape.forEach((row, y) => { row.forEach((value, x) => { if (value > 0) { if (piece.y + y >= 0) { drawSquare(piece.x + x, piece.y + y, piece.colorIndex); } } }); }); } catch (e) { console.error("Error drawing piece:", e); } }
    function updateScoreboard() { try { scoreElement.textContent = score; linesElement.textContent = lines; levelElement.textContent = level; } catch (e) { console.error("Error updating scoreboard:", e); } }

    // --- Fungsi Logika Game ---
    function createBoard() { return Array.from({ length: ROWS }, () => Array(COLS).fill(0)); }
    function getRandomPiece() { const i = Math.floor(Math.random() * SHAPES.length); const s = SHAPES[i]; const c = i + 1; return { x: Math.floor(COLS / 2) - Math.floor(s[0].length / 2), y: 0, shape: s, colorIndex: c }; }
    function isValidMove(piece, offsetX, offsetY, newShape) { try { if (!piece) return false; const shape = newShape || piece.shape; for (let y = 0; y < shape.length; y++) { for (let x = 0; x < shape[y].length; x++) { if (shape[y][x] > 0) { let testX = piece.x + x + offsetX; let testY = piece.y + y + offsetY; if (testX < 0 || testX >= COLS || testY >= ROWS) return false; if (testY >= 0 && board[testY] && board[testY][testX] > 0) return false; } } } return true; } catch (e) { console.error("Error in isValidMove:", e); return false; } }
    function rotateMatrix(matrix) { const r = matrix.length; const c = matrix[0].length; const rot = Array.from({ length: c }, () => Array(r).fill(0)); for(let y=0; y<r; y++){ for(let x=0; x<c; x++){ rot[x][r-1-y] = matrix[y][x]; } } return rot; }
    function pieceRotate() { try { if (gameOver || paused || !currentPiece) return; const oShape = currentPiece.shape; const rShape = rotateMatrix(oShape); let kickX = 0; if (!isValidMove(currentPiece, 0, 0, rShape)) { if (isValidMove(currentPiece, 1, 0, rShape)) kickX=1; else if (isValidMove(currentPiece, -1, 0, rShape)) kickX=-1; else if (isValidMove(currentPiece, 2, 0, rShape)) kickX=2; else if (isValidMove(currentPiece, -2, 0, rShape)) kickX=-2; else return; } currentPiece.shape = rShape; currentPiece.x += kickX; } catch (e) { console.error("Error rotating piece:", e); } }
    function pieceMove(dx) { try { if (gameOver || paused || !currentPiece) return; if (isValidMove(currentPiece, dx, 0)) { currentPiece.x += dx; } } catch (e) { console.error("Error moving piece:", e); } }
    function pieceDrop() { try { if (gameOver || paused || !currentPiece) return; if (isValidMove(currentPiece, 0, 1)) { currentPiece.y++; dropCounter = 0; } else { lockPiece(); const linesCleared = clearLines(); updateScore(linesCleared); spawnNewPiece(); } } catch (e) { console.error("Error dropping piece:", e); triggerGameOver(); } } // Added basic error handling for drop
    function lockPiece() { try { if (!currentPiece) return; currentPiece.shape.forEach((row, y) => { row.forEach((value, x) => { if (value > 0) { if (currentPiece.y + y >= 0) { board[currentPiece.y + y][currentPiece.x + x] = currentPiece.colorIndex; } } }); }); } catch (e) { console.error("Error locking piece:", e); } }
    function clearLines() { try { let cleared = 0; for (let r = ROWS - 1; r >= 0; ) { if (board[r].every(cell => cell > 0)) { cleared++; for (let y = r; y > 0; y--) { board[y] = [...board[y - 1]]; } board[0] = Array(COLS).fill(0); } else { r--; } } return cleared; } catch (e) { console.error("Error clearing lines:", e); return 0; } }

    function updateScore(linesCleared) { try { if (linesCleared > 0) { score += linesCleared * 100 * level * (linesCleared > 1 ? linesCleared * 0.5 : 1); lines += linesCleared; if (lines >= level * 10) { level++; const baseSpeed = 250; const speedIncrease = 15; const minSpeed = 60; dropInterval = Math.max(minSpeed, baseSpeed - (level - 1) * speedIncrease); /*console.log(`Level Up! Lvl: ${level}, Int: ${dropInterval}ms`);*/ } updateScoreboard(); } } catch (e) { console.error("Error updating score:", e); } }
    function spawnNewPiece() { try { currentPiece = getRandomPiece(); if (!isValidMove(currentPiece, 0, 0)) { triggerGameOver(); } } catch (e) { console.error("Error spawning piece:", e); triggerGameOver(); } }
    function triggerGameOver() { if(gameOver) return; /*console.log("Game Over!");*/ gameOver = true; cancelAnimationFrame(requestId); showGameOver(); }

    // --- Game Loop Utama ---
    function gameLoop(timestamp) { try { if (gameOver || paused) return; if (!lastTime) { lastTime = timestamp; } const deltaTime = timestamp - lastTime; lastTime = timestamp; dropCounter += deltaTime; if (dropCounter > dropInterval) { pieceDrop(); dropCounter = 0; } drawBoard(); if (currentPiece) { drawPiece(currentPiece); } requestId = requestAnimationFrame(gameLoop); } catch (e) { console.error("Error in game loop:", e); triggerGameOver(); } }

    // --- Fungsi Start Game ---
    function startGame() { try { /*console.log("startGame called");*/ board = createBoard(); score = 0; lines = 0; level = 1; const baseSpeed = 250; const speedIncrease = 15; const minSpeed = 60; dropInterval = Math.max(minSpeed, baseSpeed - (level - 1) * speedIncrease); gameOver = false; paused = false; updateScoreboard(); spawnNewPiece(); cancelAnimationFrame(requestId); lastTime = performance.now(); dropCounter = 0; gameLoop(lastTime); hideOverlays(); startButton.textContent = "RESTART"; } catch (e) { console.error("Error starting game:", e); } }

    // --- Fungsi Overlay ---
     function showGameOver() { gameOverOverlay.style.display = 'flex'; }
     function hideGameOver() { gameOverOverlay.style.display = 'none'; }
     function showIngetYa() { ingetYaOverlay.style.display = 'flex'; }
     function hideIngetYa() { ingetYaOverlay.style.display = 'none'; }
     function hideOverlays() { hideGameOver(); hideIngetYa(); }

    // --- Event Listeners ---
    try {
        startButton.addEventListener('click', startGame);
        leftButton.addEventListener('click', () => { pieceMove(-1); if (!gameOver && !paused && currentPiece) { drawBoard(); drawPiece(currentPiece); } }); // Redraw on move
        rightButton.addEventListener('click', () => { pieceMove(1); if (!gameOver && !paused && currentPiece) { drawBoard(); drawPiece(currentPiece); } }); // Redraw on move
        rotateButton.addEventListener('click', () => { pieceRotate(); if (!gameOver && !paused && currentPiece) { drawBoard(); drawPiece(currentPiece); } }); // Redraw on rotate
        confirmGameOverButton.addEventListener('click', () => { hideGameOver(); showIngetYa(); });
        okIngetYaButton.addEventListener('click', () => { hideIngetYa(); showGameOver(); });
        document.addEventListener('keydown', (event) => {
             if (!currentPiece && event.key === 'Enter') { startGame(); return; }
             if (gameOver || paused || !currentPiece) return;
             let redraw = false; // Flag to redraw after move/rotate
             switch (event.key) {
                 case 'ArrowLeft': case 'a': event.preventDefault(); pieceMove(-1); redraw = true; break;
                 case 'ArrowRight': case 'd': event.preventDefault(); pieceMove(1); redraw = true; break;
                 case 'ArrowDown': case 's': event.preventDefault(); pieceDrop(); break; // Drop handles its own redraw via loop
                 case 'ArrowUp': case 'w': case ' ': event.preventDefault(); pieceRotate(); redraw = true; break;
             }
             if (redraw) { // Redraw immediately after manual move/rotate
                 drawBoard();
                 drawPiece(currentPiece);
             }
         });
    } catch (e) { console.error("Error setting up listeners:", e); }

    // --- Inisialisasi Awal Section ---
    function initTetris() { try { /*console.log("initTetris called");*/ canvas.width = COLS * BLOCK_SIZE; canvas.height = ROWS * BLOCK_SIZE; board = createBoard(); score = 0; lines = 0; level = 1; const baseSpeed = 250; const speedIncrease = 15; const minSpeed = 60; dropInterval = Math.max(minSpeed, baseSpeed - (level - 1) * speedIncrease); gameOver = true; paused = false; currentPiece = null; updateScoreboard(); drawBoard(); hideOverlays(); startButton.textContent = "START GAME"; cancelAnimationFrame(requestId); } catch (e) { console.error("Error initializing Tetris:", e); } }
    window.initTetris = initTetris;

    // Panggil init sekali saat load
    try {
        initTetris();
    } catch(e) {
         console.error("Error during initial initTetris call:", e);
    }
}); // Akhir DOMContentLoaded