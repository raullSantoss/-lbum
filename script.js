const video = document.getElementById("camera");
const button = document.getElementById("capturar");
const button_pnb = document.getElementById("foto_pnb");
const button_desligar = document.getElementById("desligar");
const button_ligar = document.getElementById("ligar");

let stream;
let fotosCapturadas = [];
const maxFotos = 8;
const galeria = document.getElementById("galeria");

// Modal
const modal = document.getElementById("modal");
const imagemModal = document.getElementById("imagemModal");
const fechar = document.getElementById("fechar");

async function startCamera() {
    try {
        if (!stream) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
        }
    } catch (erro) {
        alert('Erro ao abrir a sua câmera');
    }
}

button.addEventListener('click', function () {
    const contexto = document.createElement('canvas').getContext('2d');
    const canvas = contexto.canvas;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);

    salvarFoto(canvas.toDataURL('image/png'));
});

button_pnb.addEventListener('click', function () {
    const contexto = document.createElement('canvas').getContext('2d');
    const canvas = contexto.canvas;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
    contexto.filter = 'grayscale(100%)';
    contexto.drawImage(canvas, 0, 0);

    salvarFoto(canvas.toDataURL('image/png'));
});

function salvarFoto(imagemData) {
    if (fotosCapturadas.length >= maxFotos) {
        fotosCapturadas.shift();
    }
    fotosCapturadas.push(imagemData);
    atualizarGaleria();
}

function atualizarGaleria() {
    galeria.innerHTML = '';
    fotosCapturadas.forEach(function(foto) {
        const imgElement = document.createElement('img');
        imgElement.src = foto;
        imgElement.addEventListener('click', function() {
            abrirModal(foto);
        });
        galeria.appendChild(imgElement);
    });
}

function abrirModal(foto) {
    imagemModal.src = foto;
    modal.style.display = "block";
}

fechar.addEventListener("click", function() {
    modal.style.display = "none";
});

function stopCamera() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        video.srcObject = null;
        stream = null;
    }
}

function ligarCamera() {
    if (!stream) {
        startCamera();
    }
}

button_desligar.addEventListener('click', stopCamera);
button_ligar.addEventListener('click', ligarCamera);

startCamera();
