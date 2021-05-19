// addDoc({ collection: 'files', data: { fileName: '' } })
const addDoc = async({ collection, data }) =>{
  let document = {
    ...data,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  }

  // 1. Una colección
  let collectionRef = firebase.firestore().collection(collection);

  // 2. Guardar el documento

  return collectionRef.add(document);
}

// upload({ file:  })
const upload = async ({ file }) => {
  // 1. Referencia al espacio en el bucket donde estará el archivo
  let storageRef = firebase.storage().ref().child(`images/${file.name}`);
  // 2 Subir el archivo
  await storageRef.put(file);
  // 3. Retornar la referencia

  return storageRef;
}


const publish = async ({ file }) => {
  let storageRef = await upload({file});
  return addDoc({ collection: 'files', data: { path: storageRef.fullPath } })
}

const queryImages = async () => {
  // 1. Colección
  let collection = firebase.firestore().collection('files')
                    .orderBy('createdAt','desc');
  // 2. onSnapshot a cambios en los documentos
  collection.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if(change.type === "added"){
        showImage(change.doc.data());
      }
    });
  });
}

const showImage = async (docData)=>{
  let node = document.createElement("div");
  node.classList.add("item");
  let url = await firebase.storage().ref(docData.path).getDownloadURL();
  node.innerHTML = `
    <img class='image' src='${url}' />
  `;

  let container = document.querySelector("#images");
  container.append(node);

  //Descargar archivo
  
}


async function main(){
  var firebaseConfig = {
    apiKey: "AIzaSyD1GMcv9FG6nFup1DoT7WWzJmDhQ34p-uA",
    authDomain: "firabase-files.firebaseapp.com",
    projectId: "firabase-files",
    storageBucket: "firabase-files.appspot.com",
    messagingSenderId: "640855642619",
    appId: "1:640855642619:web:d20d600bee7f27fb56fb5e"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  let form = document.querySelector("#uploader");

  form.addEventListener("submit",(ev)=>{
    ev.preventDefault();

    let fileInput = form.querySelector("#file");

    let file = fileInput.files[0];

    publish({ file });

  });

  queryImages();

  

}

main();