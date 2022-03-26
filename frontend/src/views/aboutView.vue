<template>
    <componentHeader/>
        <div class="about">
            <section class="presentation">
                <h1> What about Starting-Block ? </h1>
            </section>

            <main>
                <section class="welcome">
                    <h2>Welcome to Starting-Block !</h2>
                </section>
                <section class="intro">
                    <p>Starting-block is an individual project carried out in just over 3 weeks
                        as part of the "Computer science and Management" course offered by Polytech Montpellier.</p>
                    <p>The objective of Starting-block is to offer all athletes
                    an interface from which they can find out about upcoming
                    competitions in the sporting field that interests them 
                    and register for them. It is also possible for the latter to be 
                    informed of the latest news relating to the competitions but also to offer other users 
                    their own competitions and news.
                    </p>
                    <p>From their account, each user will then be able to see all the tournaments in which they are registered but also those which they have published and modify or delete them if they wish. The same is true for news.</p>
                </section>
            </main>
        </div>
    <componentFooter/>
</template>

<script>
    import componentHeader from '../components/header.vue';
  import componentFooter from '../components/footer.vue';

  export default{
    name: 'HomeView',
    components: {
      componentHeader,componentFooter
    },
  }
</script>

<style scoped>
    @font-face {
    font-family: Heavitas;
    src: url("../assets/Heavitas.ttf");
}

main{
    background-image: url("../assets/body_bg.png"); 
    padding: 30px; 
    min-height: 400px;
    display: flex;
    justify-content: center;
    flex-flow: column wrap;
    align-items: center;
}

.presentation{
    font-family: "Heavitas";
    font-size: 12px;
    border: solid black 1px;
    color: #130065;

  }

  .welcome{
    font-family: "Heavitas";
    font-size: 14px;
    color: white;
    padding-bottom: 30px;  
  }

  .intro{
      width: 70%;
      font-family: "Heavitas";
      font-size: 12px;
      color: white;
  }


</style>