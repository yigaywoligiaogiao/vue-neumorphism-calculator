import calculator from './calculator'

const myPlugins = {
    install(Vue,options){
        Vue.component('calculator',calculator)
    } 
}

export default myPlugins