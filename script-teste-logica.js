/*const maquina = 45;
const horasTrabalhadas = 8;
const prudutoGasto = 40; 

function pegarData() {

    const agora = new Date();

    const data = agora.toLocaleDateString(); // ex: "10/06/2025"
    const hora = agora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // ex: "14:35"

    const dados = `Tabela:\n${maquina},\n${horasTrabalhadas},\n${prudutoGasto},\n${data}, ${hora}`;

    return dados;
}

console.log(pegarData());*/

  /*function dataLancamento() {
    const dataAtual = new Date();
    const data = dataAtual.toLocaleDateString();
    const hora = dataAtual.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const dataHora = `${data}, ${hora}`;

    console.log('data:', data);
    console.log('hora:', hora);

    return dataHora;
  }

  const dataHora = dataLancamento();

  console.log(dataHora);

  console.log('data');*/

  const inforMotivo = ['Elétrico', 'Mecânico', 'Operacional', 'Programação/Manejo', 'Chuva', 'Energia/Coelba'];

  console.log(inforMotivo[inforMotivo.length -2],inforMotivo[3]);

  