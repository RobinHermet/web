<template>
    <componentHeader/>
  <div class="submitNews">

    <section class="goBackHome" v-if="!confirmationMessageIsHide">
        <h1>Your news has been submitted successfully</h1>
        <button v-on:click="backHome">BACK HOME</button>
    </section>
    
    <section class="presentation" v-if="!submitNewsFormIsHide">
        <h1>Share your news with other users!</h1>
    </section>


    <section class="submitNewsForm" v-if="!submitNewsFormIsHide">
        <div>
            <label for="title" class="placeholder">Title</label>
            <input id="title" class="input" type="text" placeholder=" " required ref="title"/>
        </div>
        <div>
            <label for="subtitle" class="placeholder">Subtitle</label>
            <input id="subtitle" class="input" type="text" placeholder=" " required ref="subtitle"/>                
        </div>
         <div>
            <label for="contents" class="placeholder">Contents</label>
            <textarea id="contents" rows="4" cols="50" required ref="contents"/>        
        </div>
    
        <button type="text" v-on:click="submitNews">SUBMIT</button>

    </section>

  </div>
  <componentFooter/>
</template>

<script>
  import axios from 'axios';
  import componentHeader from '../components/header.vue';
  import router from '../router/index.js';
import componentFooter from '../components/footer.vue';
  import Notiflix from 'notiflix';



  export default{
    name: 'NewsView',
    components: {
      componentHeader, componentFooter
    },

    data(){
        return{
            title: "",
            subtitle: "",
            contents: "",
            publishingDate: "",
            reponseServeur: {},
            confirmationMessageIsHide : true,
            submitNewsFormIsHide : false,
            formCompleted: false,
        }
    },

    methods:{
        getNewsInfos(){
            if((this.$refs.title.value !== '') && (this.$refs.subtitle.value !== '') && (this.$refs.contents.value !== '') ){

                this.title = this.$refs.title.value;
                this.subtitle = this.$refs.subtitle.value;
                this.contents = this.$refs.contents.value;
                this.formCompleted = true;
            }
            else{
                console.log("Please complete the form")
                this.formCompleted = false;
            }
        },

        async submitNews(){
            this.getNewsInfos()
            if(this.formCompleted){
                let date = new Date();
                await axios.post(process.env.VUE_APP_API+'/startingblock/news', {
                    title: this.title,
                    subtitle: this.subtitle,
                    contents: this.contents,
                    publishingDate: date.toLocaleString('en-EN',{
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric'}),
                    ownerId: sessionStorage.getItem("id")
                },
                {
                    headers: {
                        Authorization : `Bearer ${sessionStorage.getItem("Token")}` //on va chercher le token dans le sessionStorage car il faut un token valide pour réaliser ce genre de requête
                    }
                }).then(response => this.reponseServeur = response)
                console.log(this.reponseServeur)
                this.confirmationMessageIsHide = false;
                this.submitNewsFormIsHide = true;
            }
            else{
              console.log("Complete the form")
            Notiflix.Notify.failure('All fields must be correctly filled in');              

            }
        },

        backHome(){
            router.push('/home')
        }
    }
  }
</script>

<style scoped>

@font-face {
    font-family: Heavitas;
    src: url("../assets/Heavitas.ttf");
}

.submitNews{
    background-image: url("../assets/body_bg.png"); 
    padding: 30px; 
    min-height: 400px;
 
}

.presentation{
    font-family: "Heavitas";
    font-size: 15px;
    color: white;
}

.goBackHome{
    font-family: "Heavitas";
    font-size: 15px;
    color: white;
}

.goBackHome button{
   background-color: #FFB83C; 
  border: none;
  color: white;
  padding: 15px 30px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-family: "Heavitas";
  font-size: 13px ;
  transition-duration: 0.4s;
  border-radius: 5px;
}

.goBackHome button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

.submitNewsForm{
    margin:0 auto;
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    width: 30%;
    text-align: left;
  }

  input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

textarea{
    resize: none;
    width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submitNewsForm button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submitNewsForm button:hover {
  background-color: #45a049;
}

@media(max-width:900px){
    .submitNewsForm{
        width: 80%;
    }
}

</style>