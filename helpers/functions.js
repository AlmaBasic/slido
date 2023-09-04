const generator = require('generate-password');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
    hashPassword: function (pass){
        return bcrypt.hashSync(pass, saltRounds);
    },
    checkPassword: function (pass, orginal) {
        return bcrypt.compareSync(pass, orginal);
    },
    generateCode: function () {
        return generator.generate({
            length: 8,
            numbers: true,
            excludeSimilarCharacters: true
        });
    }
}