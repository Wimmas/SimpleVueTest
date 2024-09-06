<template>
    <div class="container">
        <div class="row">
            <div class="col-12 mt-5 offset-6">
                <div class="card">
                    <div class="card-header">
                        Sign Up
                    </div>
                    <div class="card-body">
                        <form @submit.prevent="register">
                            <p v-if="errors.length">
                                <b>Please correct the following error(s):</b>
                                <ul>
                                <li v-for="error in errors"  class="text-danger">{{ error }}</li>
                                </ul>
                            </p>
                            <div class="mb-3">
                                <label for="inputName" class="form-label">Name</label>
                                <input type="text" class="form-control" v-model="name" id="inputName" placeholder="Enter your name">
                            </div>
                            <div class="mb-3">
                                <label for="exampleInputEmail1" class="form-label">Email address</label>
                                <input type="email" class="form-control" v-model="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter your email">
                                <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
                            </div>
                            <div class="mb-3">
                                <label for="InputPassword" class="form-label">Password</label>
                                <input type="password" class="form-control" v-model="password" id="InputPassword">
                            </div>
                            <div class="mb-3">
                                <label for="confirmInputPassword" class="form-label">Cornfirm Password</label>
                                <input type="password" class="form-control" v-model="confirmPassword" id="confirmInputPassword">
                            </div>
                            <button type="submit" class="btn btn-primary">Sign Up</button>
                            <div id="emailHelp" class="form-text">Already have an account? <router-link to="Login">Login Here</router-link></div>
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
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

    export default{
        setup: () => ({ v$: useVuelidate() }),
        data(){
            return{
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                errors: [],
                successMsg: ''
            }
        },
        validations: {
            password: {
                required,
                minLength: minLength(6),
                containsUppercase: function(value) {
                return /[A-Z]/.test(value)
                },
                containsLowercase: function(value) {
                return /[a-z]/.test(value)
                },
                containsNumber: function(value) {
                return /[0-9]/.test(value)
                },
                containsSpecial: function(value) {
                return /[#?!@$%^&*-]/.test(value)
                }
            }
        },
        methods:{
            async register(){
                this.errors = [];
                if(!this.name) this.errors.push("Name required.");
                if(!this.email) {
                    this.errors.push("Email required.");
                } 
                else if(!this.validEmail(this.email)) {
                    this.errors.push("Valid email required.");        
                }
                const result = await this.v$.$validate()
                if(!result)
                {
                    this.errors.push('Password must contain at least one UPPERCASE letter, one lowercase letter, a number and special character. Password must also be longer than 6 characters.')
                }
                if(this.password != this.confirmPassword){
                    this.errors.push('Your passwords do not match. Please make sure the password and confirm password are the same.');
                }

                if(this.errors.length)
                {
                    return;
                }

                //api/register

                axios.post('http://localhost:3000/auth/sign-up', {
                    name: this.name,
                    email: this.email,
                    password: this.password
                }).then( async (res) => {
                    if(res.data.success){
                        router.push({ name: 'dashboard' })
                    }
                    else{
                        alert(res.data.message);
                    }
                }).catch(error => {
                    console.log(error);
                })
            },
            validEmail:function(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
        }
    }
</script>