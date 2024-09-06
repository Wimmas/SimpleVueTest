<template>
    <div class="container">
        <div class="row">
            <div class="col-12 mt-5 offset-6">
                <div class="card">
                    <div class="card-header">
                        Login
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="login">
                            <p v-if="errors.length">
                                <b>Could not login. See errors below:</b>
                                <ul>
                                <li v-for="error in errors"  class="text-danger">{{ error }}</li>
                                </ul>
                            </p>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Email address</label>
                                <input type="email" class="form-control" v-model="email" id="exampleInputEmail1" aria-describedby="emailHelp">
                                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputPassword1" class="form-label">Password</label>
                                <input type="password" class="form-control" v-model="password" id="exampleInputPassword1">
                            </div>
                            <button type="submit" class="btn btn-primary">Login</button>
                            <div id="emailHelp" class="form-text">Need a new account? <router-link to="SignUp">Sign Up Here</router-link></div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import router from '../router/index'

    export default{
        data(){
            return{
                email: '',
                password: '',
                errors: [],
                successMsg: ''
            }
        },

        methods:{
            login(){
                axios.post('http://localhost:3000/auth/sign-in', {
                    email: this.email,
                    password: this.password
                }).then( (res) => {
                    if(res.data.success){
                        router.push({ name: 'dashboard', params: {name:  res.data.user} })
                    }
                    else{
                        this.errors.push(res.data.message);
                    }
                }).catch(error => {
                    console.log(error);
                })
            }
        }
    }
</script>