//const uploader =
//TrueUploader({accepted:[],size:0,multiple:[],onadded:(e)=>{},onfail:(e)=>{},onsuccess:(e)=>{}});
function TrueUploader(interface_object) {
  const tphppath = "scripts/-uploader.php";
  const tByClass = (e) => {
    return document.getElementsByClassName(e)[0];
  };
  const tSizeOf = (e) => {
    let x = 0;
    for (i in e) {
      x++;
    }
    return x;
  };
  const openFilePicker = () => {
    tByClass("trueuploader").click();
  };
  const getAcceptedFiles = () => {
    return tByClass("trueuploader").acceptedlist;
  };
  const hasFilesToUpload = () => {
    if (tSizeOf(getAcceptedFiles()) > 0) {
      return true;
    }
    return false;
  };
  const getFileExtension = (name) => {
    let parts = name.split(".");
    return parts[tSizeOf(parts) - 1];
  };
  const resetFilePicker = () => {
    newInput();
  };
  const max_chunk_size = 10000000;
  const getAcceptedFilesNames = (newlist = []) => {
    let files = tByClass("trueuploader").acceptedlist;
    for (f in files) {
      newlist.push(files[f].name);
    }
    return newlist;
  };
  const blobToFile = (blob, filename, type) => {
    blob.name = filename;
    blob.type = type;
    return blob;
  };
  const fileReaderRead = (file) => {
    return new Promise((resolve, reject) => {
      const file_reader = new FileReader();
      file_reader.onloadend = () => {
        resolve(file_reader.result);
      };
      file_reader.readAsDataURL(file);
    });
  };
  const Messages = {
    ExceedsMaxChunk:
      "This file exceeds the max chunk size. It will be uploaded in full, but preview will be limited..",
    ExceedsAllowedSize:
      "This file exceeds maxed allowed size, please shorten or choose another..",
  };
  newInput();
  function newInput() {
    if (tByClass("trueuploader")) {
      tByClass("trueuploader").remove();
    }
    let f = document.createElement("input");
    f.type = "file";
    f.className = "trueuploader";
    f.multiple = interface_object.multiple;
    f.accept = "image/*,video/mp4";
    f.style.display = "none";
    document.body.appendChild(f);
    f.acceptedlist = [];
  }
  tByClass("trueuploader").onchange = () => {
    const files = tByClass("trueuploader").files;
    for (f in files) {
      if (files[f].size) {
        const file = files[f];
        if (interface_object.size && file.size > interface_object.size) {
          interface_object.onfail(Messages.ExceedsAllowedSize);
          return;
        }
        if (file.size <= max_chunk_size) {
          tByClass("trueuploader").acceptedlist.push(file);
        }
        if (file.size > max_chunk_size) {
          const current_filesize = file.size;
          const max_chunksize = max_chunk_size;
          const chunks_ammount = Math.ceil(current_filesize / max_chunksize);
          let chunks_tracker = 0;
          const chunking_object = {
            type: file.type,
            name: file.name,
            parts: chunks_ammount,
            track: 0,
            chunks: [],
          };

          interface_object.onfail(Messages.ExceedsMaxChunk);
          while (chunks_tracker < chunks_ammount) {
            const current_file = files[f];
            const offset = chunks_tracker * max_chunksize;
            const chunk_part = current_file.slice(
              offset,
              offset + max_chunksize
            );
            chunking_object.chunks.push(chunk_part);
            chunks_tracker++;
          }
          tByClass("trueuploader").acceptedlist.push(chunking_object);
        }
      }
    }
    interface_object.onsuccess(getAcceptedFiles());
  };
  function uploadMass(files, onProgress, onEnd) {
    return new Promise((resolve, reject) => {
      const newCopy = files.slice();
      popOff();
      function popOff() {
        uploadSingle(newCopy.shift(), onProgress, onEnd).then((r) => {
          if (newCopy.length == 0) {
            resolve();
            return;
          }
          popOff();
        });
      }
    });
  }
  const uploadChunks = async (
    chunking_object,
    dir,
    onProgress,
    onEnd,
    resolve,
    tries = 1
  ) => {
    if (!chunking_object.chunks[chunking_object.track]) {
      onEnd();
      resolve();
      return;
    }
    const chunks = chunking_object.chunks;
    const lastone = chunking_object.parts == chunking_object.track + 1;
    onProgress(
      `Uploading part ${chunking_object.track + 1}/${
        chunking_object.parts
      } of ${chunking_object.name}`
    );

    tryFetch();
    async function tryFetch() {
      let formData = new FormData();
      formData.append("file", chunks[chunking_object.track]);
      formData.append("filename", chunking_object.name);
      formData.append("finished", lastone);
      formData.append("part", chunking_object.track);
      formData.append(
        "passcode",
        SHA256(controller.querySelector("#controllerCode").value)
      );
      response = await fetch(tphppath, {
        method: "POST",
        body: formData,
      });
      if (response.status == 200) {
        chunking_object.track++;
        uploadChunks(chunking_object, dir, onProgress, onEnd, resolve);
      }
      if (response.status != 200) {
        if (tries >= 3) {
          onprogress(
            `Failure uploading ${chunking_object.name}, tried ${tries}/3`
          );
          setInterval(() => {
            onEnd();
          }, 5000);
          return;
        }
        tries++;
        onprogress(
          `Failure Uploading part ${chunking_object.track}/${chunking_object.parts} of ${chunking_object.name}, retrying ${tries}/3`
        );
        setTimeout(() => {
          tryFetch();
        }, 1000);
      }
    }
  };
  const uploadSingle = (f, onProgress, onEnd, tries = 1) => {
    return (promise = new Promise(async (resolve, reject) => {
      onProgress(`Uploading ${f.name}`);
      if (f.chunks) {
        uploadChunks(f, onProgress, onEnd, resolve);
        return;
      }
      tryFetch();
      async function tryFetch() {
        let formData = new FormData();
        formData.append("file", f);
        formData.append("filename", f.name);
        formData.append("part", 0);
        formData.append("finished", true);
        formData.append(
          "passcode",
          SHA256(controller.querySelector("#controllerCode").value)
        );
        response = await fetch(tphppath, {
          method: "POST",
          body: formData,
        });
        if (response.status == 200) {
          onEnd();
          resolve();
        }
        if (response.status != 200) {
          if (tries >= 3) {
            onprogress(`Failure uploading ${f.name}, tried ${tries}/3`);
            setInterval(() => {
              onEnd();
            }, 5000);
            return;
          }
          tries++;
          onprogress(`Failure uploading ${f.name}, retrying ${tries}/3`);
          setTimeout(() => {
            tryFetch();
          }, 1000);
        }
      }
    }));
  };
  return {
    uploadStart: uploadMass,
    getAcceptedFiles: () => {
      return getAcceptedFiles();
    },
    getAcceptedFilesNames: () => {
      return getAcceptedFilesNames();
    },
    openFilePicker: () => {
      openFilePicker();
    },
    getBoundingElement: interface_object.boundingelement,
    hasFilesToUpload: () => {
      return hasFilesToUpload();
    },
    resetFilePicker: () => {
      resetFilePicker();
    },
    blobToFile: blobToFile,
    readFile: fileReaderRead,
  };
}
