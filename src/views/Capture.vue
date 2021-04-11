<template>
  <b-container>
    <div id="create-post" ref="createPostArea">
      <video ref="videoPlayer" id="player" autoplay></video>
      <canvas
        ref="canvasElement"
        id="canvas"
        width="320px"
        height="240px"
      ></canvas>
      <b-button id="capture-btn" ref="captureButton"> Capture </b-button>

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

      <br />
      <div>
        <button
          class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-color--accent"
          type="submit"
          id="post-btn"
        >
          Post!
        </button>
      </div>
      <br />
      <div>
        <button
          class="mdl-button mdl-js-button mdl-button--fab"
          id="close-create-post-modal-btn"
          type="button"
        >
          <i class="material-icons">close</i>
        </button>
      </div>
    </div>
    <div class="page-content">
      <h5 class="text-center mdl-color-text--primary">Share your duck face!</h5>
      <div id="shared-moments"></div>
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
export default {
  name: "Capture",
  data() {
    return {
      form: {},
    };
  },
//   mounted() {
//    this.initializeMedia();
//     this.initializeLocation();
//   },
  methods: {
      initializeLocation() {
    if (!('geolocation' in navigator)) {
        this.$refs.locationButton.style.display = 'none';
    }
},
initializeMedia (){
    let videoPlayer = this.$refs.videoPlayer
    if (!('mediaDevices' in navigator)) {
        navigator.mediaDevices = {};
    }

    if (!('getUserMedia' in navigator.mediaDevices)) {
        navigator.mediaDevices.getUserMedia = (constraints) => {
            const getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented!'));
            }

            return new Promise((resolve, reject) => getUserMedia.call(navigator, constraints, resolve, reject));
        };
    }

    navigator.mediaDevices.getUserMedia({video: {facingMode: 'user'}, audio: false})
        .then(stream => {
            videoPlayer.srcObject = stream;
            videoPlayer.style.display = 'block';
            videoPlayer.setAttribute('autoplay', '');
            videoPlayer.setAttribute('muted', '');
            videoPlayer.setAttribute('playsinline', '');
        })
        .catch(error => {
            console.log(error);
        });
},
closeCreatePostModal(){
    this.$refs.videoPlayer.style.display = 'none';
    this.$refs.canvasElement.style.display = 'none';
    this.$refs.captureButton.style.display = 'inline';
    this.$refs.locationButton.style.display = 'inline';
    this.$refs.locationLoader.style.display = 'none';
    if (this.$refs.videoPlayer.srcObject) {
        this.$refs.videoPlayer.srcObject.getVideoTracks().forEach(track => track.stop());
    }
    setTimeout(() => this.$refs.createPostArea.style.transform = 'translateY(100vh)', 1);
},

openCreatePostModal() {
    setTimeout(() => this.$refs.createPostArea.style.transform = 'translateY(0)', 1);
    this.initializeMedia();
    this.initializeLocation();
},
getLocation(){},
    onSubmit() {
      console.log(this.form);
    },
  },
};
</script>

<style>
</style>