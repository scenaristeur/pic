<template>
  <b-container>
    <div id="create-post" ref="createPostArea">
      <video ref="videoPlayer" id="player" autoplay  width="320px"
        height="240px"></video>
      <canvas
        ref="canvasElement"
        id="canvas"
        width="320px"
        height="240px"
      ></canvas>
      <b-button id="capture-btn" ref="captureButton" @click="capture">
        Capture
      </b-button>

      <!-- <b-form @submit="onSubmit" @reset="onReset"> -->
      <!-- <b-form> -->
      <b-form-group
        id="input-group-title"
        label="Title:"
        label-for="input-title"
        description="Give a cool title to your Post."
      >
        <b-form-input
          id="input-title"
          v-model="form.title"
          type="text"
          placeholder="Enter title"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group
        id="input-group-location"
        label="Location:"
        label-for="input-location"
        description="Add a location."
      >
        <b-form-input
          id="input-location"
          v-model="form.location"
          type="text"
          placeholder="Enter location"
          required
        ></b-form-input>
        <b-button ref="locationButton" @click="getLocation"
          >Get Location</b-button
        >
      </b-form-group>

      <b-button @click="onSubmit" variant="primary">Post!</b-button>
      <b-button @click="closeCreatePostModal" variant="danger">Reset</b-button>
      <!-- </b-form> -->
      <b-card class="mt-3" header="Form Data Result">
        <pre class="m-0">{{ form }}</pre>
      </b-card>

      <hr />
      <div
        id="location-loader"
        ref="locationLoader"
        class="mdl-spinner mdl-js-spinner is-active"
      ></div>
    </div>
    <div class="page-content">
      <h5 class="text-center mdl-color-text--primary">Share your duck face!</h5>
      <div ref="sharedMomentsArea" id="shared-moments"></div>
    </div>
    <div class="floating-button">
      <button
        class="mdl-button mdl-js-button mdl-button--fab mdl-button--colored"
        id="share-image-button"
        @click="openCreatePostModal"
      >
        <i class="material-icons">add</i>
        Share Image button
      </button>
    </div>
    <div
      id="confirmation-toast"
      aria-live="assertive"
      aria-atomic="true"
      aria-relevant="text"
      class="mdl-snackbar mdl-js-snackbar"
    >
      <div class="mdl-snackbar__text"></div>
      <button type="button" class="mdl-snackbar__action"></button>
    </div>
  </b-container>
</template>

<script>
//import '@/utils/utility.js'
import * as idb from "@/lib/idb.js";
// // TODO: Change this with your own local IP (either localhost/127.0.0.1) or the IP assigned by the phone hot spot
// // const SERVER_URL = "http://localhost:3000";
// // const API_URL = `${SERVER_URL}/selfies`;

const dbPromise = idb.openDb("selfies-store", 1, (upgradeDB) => {
  if (!upgradeDB.objectStoreNames.contains("selfies")) {
    upgradeDB.createObjectStore("selfies", { keyPath: "id" });
  }

  if (!upgradeDB.objectStoreNames.contains("sync-selfies")) {
    upgradeDB.createObjectStore("sync-selfies", { keyPath: "id" });
  }
});

export default {
  name: "Capture",
  data() {
    return {
      form: { title: "", location: "", picture: null },
      fetchedLocation: { lat: 0, lng: 0 },
    };
  },
  //   mounted() {
  //    this.initializeMedia();
  //     this.initializeLocation();
  //   },
  methods: {
    initializeLocation() {
      if (!("geolocation" in navigator)) {
        this.$refs.locationButton.style.display = "none";
      }
    },
    initializeMedia() {
      let videoPlayer = this.$refs.videoPlayer;
      if (!("mediaDevices" in navigator)) {
        navigator.mediaDevices = {};
      }

      if (!("getUserMedia" in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = (constraints) => {
          const getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

          if (!getUserMedia) {
            return Promise.reject(
              new Error("getUserMedia is not implemented!")
            );
          }

          return new Promise((resolve, reject) =>
            getUserMedia.call(navigator, constraints, resolve, reject)
          );
        };
      }

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: false })
        .then((stream) => {
          videoPlayer.srcObject = stream;
          videoPlayer.style.display = "block";
          videoPlayer.setAttribute("autoplay", "");
          videoPlayer.setAttribute("muted", "");
          videoPlayer.setAttribute("playsinline", "");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    closeCreatePostModal() {
      this.$refs.videoPlayer.style.display = "none";
      this.$refs.canvasElement.style.display = "none";
      this.$refs.captureButton.style.display = "inline";
      this.$refs.locationButton.style.display = "inline";
      this.$refs.locationLoader.style.display = "none";
      if (this.$refs.videoPlayer.srcObject) {
        this.$refs.videoPlayer.srcObject
          .getVideoTracks()
          .forEach((track) => track.stop());
      }
      setTimeout(
        () => (this.$refs.createPostArea.style.transform = "translateY(100vh)"),
        1
      );
    },

    openCreatePostModal() {
      setTimeout(
        () => (this.$refs.createPostArea.style.transform = "translateY(0)"),
        1
      );
      this.initializeMedia();
      this.initializeLocation();
    },
    getLocation() {
      let app = this;
      if (!("geolocation" in navigator)) {
        return;
      }
      let sawAlert = false;

      this.$refs.locationButton.style.display = "none";
      this.$refs.locationLoader.style.display = "block";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.$refs.locationButton.style.display = "inline";
          this.$refs.locationLoader.style.display = "none";
          this.fetchedLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const reverseGeocodeService =
            "https://nominatim.openstreetmap.org/reverse";
          fetch(
            `${reverseGeocodeService}?format=jsonv2&lat=${this.fetchedLocation.lat}&lon=${this.fetchedLocation.lng}`
          )
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              app.form.location = `${data.address.country}, ${data.address.state}`;
              //   document
              //     .querySelector("#manual-location")
              //     .classList.add("is-focused");
            })
            .catch((error) => {
              console.log(error);
              this.$refs.locationButton.style.display = "inline";
              this.$refs.locationLoader.style.display = "none";
              if (!sawAlert) {
                alert("Couldn't fetch location, please enter manually!");
                sawAlert = true;
              }
              this.fetchedLocation = { lat: 0, lng: 0 };
            });
        },
        (error) => {
          console.log(error);
          this.$refs.locationButton.style.display = "inline";
          this.$refs.locationLoader.style.display = "none";
          if (!sawAlert) {
            alert("Couldn't fetch location, please enter manually!");
            sawAlert = true;
          }
          this.fetchedLocation = { lat: 0, lng: 0 };
        },
        { timeout: 7000 }
      );
    },
    onSubmit() {
      console.log(this.form);
      if (
        this.form.title.trim() === "" ||
        this.form.location.trim() === "" ||
        !this.form.picture
      ) {
        // Very professional validation
        alert("Please enter valid data!");
        return;
      }

      this.closeCreatePostModal();

      const id = new Date().getTime();
      console.log(navigator.serviceWorker, window.SyncManager);
      let app = this
      try {
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          navigator.serviceWorker.ready.then((sw) => {
            const selfie = {
              id: id,
              title: this.form.title,
              location: this.form.location,
              selfie: this.form.picture,
            };
            console.log(selfie);
            app.writeData("sync-selfies", selfie)
              .then(() => sw.sync.register("sync-new-selfies"))
              .then(() => {
                const snackbarContainer = document.querySelector(
                  "#confirmation-toast"
                );
                const data = { message: "Your Selfie was saved for syncing!" };
                alert(data);
                snackbarContainer.MaterialSnackbar.showSnackbar(data);

                app.readAllData("sync-selfies").then((syncSelfies) => {
                  app.updateUI(syncSelfies);
                });
              })
              .catch(function (err) {
                console.log(err);
              });
          });
        } else {
          alert("no service worker or sync manager");
        }
      } catch (e) {
        alert(e);
      }
    },
    createCard(selfie) {
      if (!selfie.selfie) return;
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "shared-moment-card mdl-card mdl-shadow--2dp";

      const cardTitle = document.createElement("div");
      const blobUrl = URL.createObjectURL(selfie.selfie);
      cardTitle.className = "mdl-card__title";
      cardTitle.style.backgroundImage = "url(" + blobUrl + ")";
      cardTitle.style.backgroundSize = "cover";
      cardWrapper.appendChild(cardTitle);

      const cardTitleTextElement = document.createElement("h2");
      cardTitleTextElement.style.color = "white";
      cardTitleTextElement.className = "mdl-card__title-text";
      cardTitleTextElement.textContent = selfie.title;
      cardTitle.appendChild(cardTitleTextElement);

      const cardSupportingText = document.createElement("div");
      cardSupportingText.className = "mdl-card__supporting-text";
      cardSupportingText.textContent = selfie.location;
      cardSupportingText.style.textAlign = "center";
      cardWrapper.appendChild(cardSupportingText);

      // Material design lite stuff
      //componentHandler.upgradeElement(cardWrapper);

      this.$refs.sharedMomentsArea.appendChild(cardWrapper);
    },

    clearCards() {
      while (this.$refs.sharedMomentsArea.hasChildNodes()) {
        this.$refs.sharedMomentsArea.removeChild(
          this.$refs.sharedMomentsArea.lastChild
        );
      }
    },
    updateUI(selfies) {
      this.clearCards();
      selfies.forEach((selfie) => this.createCard(selfie));
    },
    capture() {
      this.$refs.canvasElement.style.display = "block";
      this.$refs.videoPlayer.style.display = "none";
      this.$refs.captureButton.style.display = "none";
      const context = this.$refs.canvasElement.getContext("2d");
      context.drawImage(
        this.$refs.videoPlayer,
        0,
        0,
        this.$refs.canvasElement.width,
        this.$refs.videoPlayer.videoHeight /
          (this.$refs.videoPlayer.videoWidth / this.$refs.canvasElement.width)
      );
      this.$refs.videoPlayer.srcObject
        .getVideoTracks()
        .forEach((track) => track.stop());
      this.form.picture = this.dataURItoBlob(
        this.$refs.canvasElement.toDataURL()
      );
    },
    dataURItoBlob(dataURI) {
      const byteString = atob(dataURI.split(",")[1]);
      const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
      return blob;
    },

    writeData(storeName, data) {
      return dbPromise.then((db) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.put(data);
        return tx.complete;
      });
    },
    readAllData(storeName) {
      return dbPromise.then((db) => {
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        return store.getAll();
      });
    },
    clearAllData(storeName) {
      return dbPromise.then((db) => {
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        store.clear();
        return tx.complete;
      });
    },
    deleteItemFromData(storeName, id) {
      dbPromise
        .then((db) => {
          const tx = db.transaction(storeName, "readwrite");
          const store = tx.objectStore(storeName);
          store.delete(id);
          return tx.complete;
        })
        .then(() => console.log("Item deleted!"));
    },
  },
};
</script>

<style>
#create-post {
  z-index: 1001;
  position: fixed;
  width: 100%;
  min-height: 100vh;
  overflow-y: scroll;
  bottom: 0;
  top: 56px;
  background: white;
  text-align: center;
  transform: translateY(100vh);
  transition: transform 0.3s;
}

.main-image {
  max-width: 100%;
  margin: auto;
  display: block;
}

.floating-button {
  z-index: 1000;
  position: fixed;
  bottom: 0;
  right: 0;
  padding: 30px;
}

.input-section {
  display: block;
  margin: 10px auto;
}

#create-post video,
#create-post canvas {
  width: 512px;
  max-width: 100%;
  display: none;
  margin: auto;
}

#create-post #pick-image,
#create-post #location-loader {
  display: none;
}

#create-post #capture-btn {
  margin: 10px auto;
}

.shared-moment-card.mdl-card {
  margin: 10px auto;
  width: 80%;
}

@media (min-width: 600px) {
  .shared-moment-card.mdl-card {
    width: 60%;
  }
}

@media (min-width: 1000px) {
  .shared-moment-card.mdl-card {
    width: 45%;
  }
}

.shared-moment-card .mdl-card__title {
  height: 140px;
}

@media (min-height: 700px) {
  .shared-moment-card .mdl-card__title {
    height: 360px;
  }
}

@media (min-height: 1000px) {
  .shared-moment-card .mdl-card__title {
    height: 200px;
  }
}
</style>