//Definição da classe Animal

class Animal {
    constructor(especie = '', tamanho = 0, biomas = [], alimentacao = '') {
        this._especie = especie;
        this._tamanho = tamanho;
        this._biomas = biomas;
        this._alimentacao = alimentacao;
    }

    static instanciaAnimais() {
        const leao = new Animal('LEAO', 3, ['savana'], 'carnivoro');
        const leopardo = new Animal('LEOPARDO', 2, ['savana'], 'carnivoro');
        const crocodilo = new Animal('CROCODILO', 3, ['rio'], 'carnivoro');
        const macaco = new Animal('MACACO', 1, ['savana', 'floresta'], 'onivoro');
        const gazela = new Animal('GAZELA', 2, ['savana'], 'herbivoro');
        const hipopotamo = new Animal('HIPOPOTAMO', 4, ['savana', 'rio'], 'onivoro');

        return [leao, leopardo, crocodilo, macaco, gazela, hipopotamo];
    }
}

//Definição da classe RecintosZoo

class RecintosZoo {
    constructor(numero, bioma, tamanhoTotal, animaisExistentes = {}, espacoOcupado = 0) {
        this._numero = numero;
        this._bioma = bioma;
        this._tamanhoTotal = tamanhoTotal;
        this._animaisExistentes = animaisExistentes;
        this._espacoOcupado = espacoOcupado;
    }

    static instanciaRecintos() {
        const recinto1 = new RecintosZoo(1, ['savana'], 10, { 'MACACO': 3 }, 3);
        const recinto2 = new RecintosZoo(2, ['floresta'], 5, {}, 0);
        const recinto3 = new RecintosZoo(3, ['savana', 'rio'], 7, { 'GAZELA': 1 }, 2);
        const recinto4 = new RecintosZoo(4, ['rio'], 8, {}, 0);
        const recinto5 = new RecintosZoo(5, ['savana'], 9, { 'LEAO': 1 }, 3);

        return [recinto1, recinto2, recinto3, recinto4, recinto5];
    }

    validaRecinto(recinto, animal, quantidade) {

        // Validação do bioma
        const biomaValido = animal._biomas.some(b => recinto._bioma.includes(b));
        if (!biomaValido) {
            return false;
        }

        // Verifica se há espaço suficiente
        const espacoNecessario = (animal._tamanho * quantidade) + 
            (Object.keys(recinto._animaisExistentes).length > 0 ? 1 : 0);
        if ((recinto._espacoOcupado + espacoNecessario) > recinto._tamanhoTotal) {
            return false;
        }

        // Regras para carnívoros
        if ((animal._alimentacao === 'carnivoro' && Object.keys(recinto._animaisExistentes).length > 0 && this.verificaCarnivoro() == false)
        || (animal._alimentacao != 'carnivoro' && Object.keys(recinto._animaisExistentes).length > 0 && this.verificaCarnivoro() == true)){
            return false;
        }

        // Regras para hipopótamos
        if (animal._especie === 'HIPOPOTAMO' && Object.keys(recinto._animaisExistentes).length > 0 
        && (!recinto._bioma.includes('savana') || !recinto._bioma.includes('rio'))) {
            return false;
        }

        // Regras para macacos
        if (animal._especie === 'MACACO' && Object.keys(recinto._animaisExistentes).length === 0 && quantidade < 2) {
            return false;
        }

        return true;
    }

    calculaEspacoRestante(animal, quantidade) {

        // Verifica se há mais de uma espécie no recinto
        const maisDeUmaEspecie = Object.keys(this._animaisExistentes).some(especie => especie !== animal._especie);

        // Calcula o espaço usado com o ajuste se houver mais de uma espécie
        const espacoUsado = this._espacoOcupado + (animal._tamanho * quantidade) + (maisDeUmaEspecie ? 1 : 0);
        return this._tamanhoTotal - espacoUsado;

    }          

    verificaCarnivoro() {
        // Verifica se só há carnívoros no recinto
        return Object.keys(this._animaisExistentes).every(animal => {
            // Lista de carnívoros
            return ['LEAO', 'LEOPARDO', 'CROCODILO'].includes(animal);
        });
    }

    analisaRecintos(animal, quantidade) {
        const animais = Animal.instanciaAnimais();
        const recintos = RecintosZoo.instanciaRecintos();

        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const animalObj = animais.find(a => a._especie === animal);

        if (!animalObj) {
            return { erro: "Animal inválido" };
        }

        const recintosViaveis = recintos.filter(r => r.validaRecinto(r, animalObj, quantidade));

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        return {
            recintosViaveis: recintosViaveis.map(r => {
                const espacoLivre = r.calculaEspacoRestante(animalObj, quantidade);
                return `Recinto ${r._numero} (espaço livre: ${espacoLivre} total: ${r._tamanhoTotal})`;
            }).sort((a, b) => a._numero - b._numero)
        };
    }

}

export { RecintosZoo as RecintosZoo };
