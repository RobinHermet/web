<template>
  <div class="index">
  <section id="title">
    <h1>To access the website, login or create an account</h1>
    <div class="buttons" v-if="!buttonsAreHide">

      <button v-on:click="revealSignupHideLog">SIGN UP</button>
      <button v-on:click="revealLoginHideSign">LOGIN</button>
      
    </div>
  </section>

    <p v-if="!registrationMessageIsHide">Your registration has been taken into account, please log in.</p>

    <section class="welcome" v-if="!signupIsHide">
      <div class="title">Welcome</div>
      <div class="subtitle">Let's create your account!</div>
    </section>

    <section class="signupForm" v-if="!signupIsHide">
        <div>
            <label for="name" class="placeholder">First name:</label>
            <input id="name" class="input" type="text" placeholder=" " required ref="firstname"/>
        </div>
        <div>
            <label for="surname" class="placeholder">Last name:</label>
            <input id="surname" class="input" type="text" placeholder=" " required ref="lastname"/>                
        </div>
        <div>
            <label for="age" class="placeholder">Age:</label>
            <input id="age" class="input" type="number" min="0" max="100" placeholder=" " required ref="age"/>
        </div>
        <div>
            <label for="city" class="placeholder">City:</label>
            <input id="city" class="input" type="text" placeholder=" " required ref="city"/>             
        </div>
        <div>
            <label for="signupEmail" class="placeholder">Email:</label>
            <input id="signupEmail" class="input" type="email" placeholder=" " required ref="signupEmail"/>             
        </div>
        <div>
            <label for="signupPassword" class="placeholder">Password:</label>
            <!--<input id="signupPassword" class="input" type="password" placeholder=" " required ref="signupPassword"/>  -->
            <input :class='{valid:passwordValidation.valid}' type="password" v-model="signupPassword">      
        </div>
        <transition name="passwordRules" appear>
          <div v-if='passwordValidation.errors.length > 0' class='passwordRules'>
            <h2>Password rules</h2>
            <p v-for='error in passwordValidation.errors' :key="error"> {{error}}</p>
          </div>
        </transition>
        <button type="text" v-on:click="submitRegistration" v-if="passwordValidation.valid">SUBMIT</button>

    </section>

    <section class="welcomeBack" v-if="!loginIsHide">
      <div class="title">Welcome Back !</div>
      <div class="subtitle">Please log in</div>  
    </section>

    <section class="loginForm" v-if="!loginIsHide">   
            <div>
                <label for="loginEmail" class="placeholder">Email:</label>
                <input id="loginEmail" class="input" type="email" placeholder=" " required ref="loginEmail"/>
            </div>
            <div>
                <label for="loginPassword" class="placeholder">Password:</label>
                <input id="loginPassword" class="input" type="password" placeholder=" " required ref="loginPassword"/>          
            </div>
            <button type="text" v-on:click="submitLogin">SUBMIT</button>
          
      </section>

  </div>
</template>

<script>
  import axios from 'axios';
  import router from '../router/index.js';
  import CryptoJS from 'crypto-js';
  import Notiflix from 'notiflix';
  

  export default{
    data(){
      return{
        // SIGNUP DATAS //
        firstname: "",
        lastname: "",
        age: 0,
        city: "",
        signupEmail:"",
        signupPassword:"",
        reponseServeur: {},
        signupIsHide: true,
        registrationMessageIsHide: true,
        buttonsAreHide: false,
        rules: [
				{ message:'One lowercase letter required.', regex:/[a-z]+/ },
				{ message:"One uppercase letter required.",  regex:/[A-Z]+/ },
				{ message:"8 characters minimum.", regex:/.{8,}/ },
				{ message:"One number required.", regex:/[0-9]+/ }
			],
        submitIsHide: true,
        formCompleted: false,
       
        // LOGIN DATAS //
        loginEmail:"",
        loginPassword:"",
        token: '', //le token renvoyé par le serveur pour chaque user est stocké ici
        loginIsHide: true,
      }
    },

    methods:{

      revealLoginHideSign(){
        this.loginIsHide = false;
        this.signupIsHide = true;
      },

      revealSignupHideLog(){
        this.loginIsHide = true;
        this.signupIsHide = false;
      },

    ///////////////////////////////// SIGNUP METHODS //////////////////////////////////////////
      // C'est fonctionnel, lorsque l'utilisateur appuie sur submit, on retrouve bien les données entrées dans la bd
      //On vérifie d'abord qu'il ait bien rempli tous les inputs
      //De plus le bouton submit ne s'affiche que lorsque toutes les règles de regex sont respectées
      getSignupInfos(){ //permet de récupérer les données rentrées par l'utilisateur dans les input 
          if((this.$refs.firstname.value !== '') && (this.$refs.lastname.value !== '') && (this.$refs.age.value !== '') && (this.$refs.city.value !== '') && (this.$refs.signupEmail.value !== '')){
            this.firstname = this.$refs.firstname.value;
            this.lastname = this.$refs.lastname.value;
            this.age = this.$refs.age.value;
            this.city = this.$refs.city.value;
            this.signupEmail = this.$refs.signupEmail.value.trim();
            //this.signupPassword = this.$refs.signupPassword.value.trim();
              // eslint-disable-next-line
            if (!this.signupEmail.match(/[a-z0-9_\-\.]+@[a-z0-9_\-\.]+\.[a-z]+/i)) {
              Notiflix.Notify.failure('Please enter a valid email adress');
              this.formCompleted = false;
            }
            else{
              this.formCompleted = true;
            }
          }
    
          else{
            console.log("Please complete the form")
            this.formCompleted = false;
          }
    
        },
        
        // le formulaire doit être entièrement rempli pour être envoyé 
        async submitRegistration(){ //au clic sur le bouton submit, on fait une requête post vers notre api pour envoyer les données vers le back, on décrypte le mdp pour vérifier si l'utilisateur peut se connecter
            this.getSignupInfos()
            if(this.formCompleted){
              await axios.post(process.env.VUE_APP_API+'/startingblock/athlete/signup',{
                name: this.firstname,
                surname: this.lastname,
                age: this.age,
                city: this.city,
                email: this.signupEmail,
                password: CryptoJS.AES.encrypt(this.signupPassword,process.env.VUE_APP_CRYPTO).toString(),
            }).then(response => this.reponseServeur = response )
            console.log(this.reponseServeur);
            Notiflix.Notify.success('Registration taken into account');
            this.signupIsHide = true;
            this.loginIsHide = false;
            this.registrationMessageIsHide = false;
            this.buttonsAreHide = true;
            this.formCompleted = false;
            }
            else{
              console.log("Complete the form")
              Notiflix.Notify.failure('All fields must be correctly filled in');              
            }
            
        },


      ///////////////////////////////// LOGIN METHODS //////////////////////////////////////////

      getLoginInfos(){
        if((this.$refs.loginEmail.value !== '') && (this.$refs.loginPassword.value !== '')){

          this.loginEmail = this.$refs.loginEmail.value.trim();
          this.loginPassword = this.$refs.loginPassword.value.trim();
          this.formCompleted = true;
        }
        else{
          console.log("Please complete the form")
          this.formCompleted = false;
        }
      },

      async submitLogin(){
          this.getLoginInfos()
          if(this.formCompleted){
            await axios.post(process.env.VUE_APP_API+'/startingblock/athlete/login',{
                email: this.loginEmail,
                password: CryptoJS.AES.encrypt(this.loginPassword,process.env.VUE_APP_CRYPTO).toString()
            }).then(response => {
              sessionStorage.setItem("Token",response.data.token); //on stocke le token dans le navigateur 
              sessionStorage.setItem("id",response.data.athleteId);
              sessionStorage.setItem("isAdmin",response.data.isAdmin);
              router.push('/home');
              console.log(response)
            }).catch(err => {
                console.log('Wrong password or e-mail' || err)
                Notiflix.Notify.failure('Wrong password or e-mail');
              })
          }
          else{
              console.log("Complete the form")
              Notiflix.Notify.failure('All fields must be correctly filled in');              
            }
      },

    },

    computed: {
		passwordsFilled () {
			return (this.signupPassword !== '' )
		},
		passwordValidation () {
			let errors = []
			for (let condition of this.rules) {
				if (!condition.regex.test(this.signupPassword)) {
					errors.push(condition.message)
				}
			}
			if (errors.length === 0) {
				return { valid:true, errors }
			} else {
				return { valid:false, errors }
			}
		}
	}

  }
</script>

<style scoped>
@font-face {
    font-family: Heavitas;
    src: url("../assets/Heavitas.ttf");
}

  section h1{
    font-family: "Heavitas";
    font-size: 20px;
  }
  .buttons button{
  background-color: #130065; 
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px ;
  margin: 15px;
  transition-duration: 0.4s;
  border-radius: 5px;

  }

  .buttons button:hover{
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
    cursor: pointer;
    background-color: white; 
    color: #130065;
  }

  .welcome{
    margin: 30px;
    font-family: "Heavitas"

  }

  .signupForm{
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

input[type=number], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=email], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=password], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.signupForm button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.signupForm button:hover {
  background-color: #45a049;
}

.welcomeBack{
    margin: 30px;
    font-family: "Heavitas"

  }

  .loginForm{
    margin:0 auto;
    border-radius: 5px;
    background-color: #f2f2f2;
    padding: 20px;
    width: 30%;
    text-align: left;
  }


input[type=email], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type=password], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.loginForm button {
  width: 100%;
  background-color: #4CAF50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loginForm button:hover {
  background-color: #45a049;
}

div>h2{
  font-family: "Heavitas";
  font-size: 20px;

}

@media(max-width:900px){
    .loginForm, .signupForm{
        width: 80%;
    }
}


</style>