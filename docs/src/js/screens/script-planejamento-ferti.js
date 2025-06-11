function somar(num) {
    var total = 0;

    for (let x = 0; x < num; x++) {
        total += x;
    }
    return total;
}

console.log(somar(15));

x= 3;
y = x * 3;
z = 4 * x / y;
console.log(x + y * z);

function faz (n) {
    s = n.toString();
    variavel = 0;
    for ( c of s ) {
        d = parseInt(c);
        variavel += d;
    }
    return variavel;
}

resultado = faz(123123);
console.log("Resultado: ", resultado);