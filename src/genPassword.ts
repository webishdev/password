const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const digits = '0123456789';
const special = '!$%&#?';

const random = (min:number, max:number):number => Math.floor(Math.random() * (max - min)) + min;

const genPassword = (length:number=32, useLowercase:boolean=true, useUppercase:boolean=false, useDigits:boolean=false, useSpecial:boolean=false):string => {
    const charPool:string[] = [];
    if (useLowercase) {
        lowercase.split('').forEach(char => charPool.push(char));
    }

    if (useUppercase) {
        uppercase.split('').forEach(char => charPool.push(char));
    }

    if (useDigits) {
        digits.split('').forEach(char => charPool.push(char));
    }

    if (useSpecial) {
        special.split('').forEach(char => charPool.push(char));
    }

    const result:string[] = [];


    for (let index = 0; index < length; index++) {

        const take = random(0, charPool.length);

        result.push(charPool[take]);
    }

    return result.join('');
}

export default genPassword;