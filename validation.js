let yup = require('yup');

const registerValidation = () => {

    const schema = yup.object().shape({
        name: yup.string().min(6).required(),
        email: yup.string().min(6).required().email(),
        password: yup.string().min(6).required()
    });

    return schema;
        
}

const loginValidation = async (data) => {

    const schema = yup.object().shape({
        email: yup.string().min(6).required().email(),
        password: yup.string().min(6).required()
    });

    return schema;
          
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;