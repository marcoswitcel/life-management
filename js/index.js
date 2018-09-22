var DB  = null; // eslint-disable-line no-unused-vars

/* CashFlowModel, pode ser usado para validar os dados */
function CashFlow(type, value, obs) {

    if (
        type === undefined || value === undefined ||
        type === null || value === null 
    ) {
        throw "Não pode construir CashFlow entry com 'undefined' ou 'null'";
    }

    /* Scheme da tabela*/
    return {
        /* Data da entrada, geralmente é a mesma da data da inserção */
        data: (new Date).getTime(),
        /* Tipo da entrada: despesa, receita  */
        tipo: type,
        /* Número inteiro ou float */
        valor: value,
        /* Observações gerais, caso quiser */
        obs: obs
    };
}
CashFlow.toString = function () {
    return this.name;
};
/* CashFlow DAO method */
CashFlow.save = function CashFlowSave(cashFlowEntry) {
    var transaction = window.DB.transaction(["CashFlow"], "readwrite");
    //transaction.oncomplete = console.log.bind(console);
    //transaction.onerror = console.log.bind(console);
    var objectStore = transaction.objectStore("CashFlow");
    var request = objectStore.add(cashFlowEntry);
    request.onsuccess = console.log.bind(console); // eslint-disable-line no-console
};
CashFlow.findAll = function CashFlowFindAll(callback) {
    var objectStore = window.DB.transaction("CashFlow").objectStore("CashFlow");

    var resultado = [];

    objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
            resultado.push(cursor.value);
            cursor.continue();
        } else {
            callback(resultado);
        }
    };
};
/* End */
function processaDados(array) { // eslint-disable-line no-unused-vars

    var despesas = [],
        receitas = [];

    var sum = function sum(list) {
        var resultado = 0;
        list.forEach(function (x) {
            resultado += x.valor;
        });
        return resultado;
    };

    for (var i = array.length; --i;) {
        if (array[i].tipo == "despesa") {
            despesas.push(array[i]);
        } else {
            receitas.push(array[i]);
        }
    }
    var texto = "Despesas: " + sum(despesas) + " -- Receitas: " + sum(receitas);
    app.appendChild(document.createTextNode(texto)); // eslint-disable-line no-undef
}

/* Carrega DB ou seta se for o primeiro loading */
(function IndexDBSetup(globalScope, console) {
    /* Testa suporte */
    if (!window.indexedDB) throw "IndexDB não é suportado";

    /* Funções gerenciadoras de erros */
    function logErro(event) {
        console.log(event);
    }
    
    /* Abre a database */
    var DB_VERSION = 3;
    var dataBase = null;
    var request = window.indexedDB.open("LifeManagementAppDB", DB_VERSION);

    /* Seção assíncrona */
    request.onsuccess = function (event) {
        /* DataBase definida */
        dataBase = event.target.result;
        /* Seta handler de erro da db */
        dataBase.onerror = logErro;
        /* Exportando */
        globalScope.DB = dataBase;
    };
    request.onerror = function (event) {
        console.log(event);
        throw "DataBase Error Handler: \nerro ao abrir a DataBase.";
    };
    /*
        Event 'onupgradeneeded':
        Unico lugar onde você pode criar ou alterar a estrutura da database
    */
    request.onupgradeneeded = function (event) {
        var db = event.target.result;
        /* "keyPath" define a propriedade que tem que ser unica em cada objeto */
        /* var objectStore = db.createObjectStore("CashFlow", { keyPath : "id" }); */
        var objectStore = db.createObjectStore(CashFlow.name, { autoIncrement : true });

        /* Exemplo */
        objectStore.transaction.oncomplete = function () {};
    };
})(window, console);

(function main(globalScope) {
    globalScope.add = function add(ctx) {
        var tipo = ctx.parentNode.dataset.type;
        var valor = +ctx.parentNode.querySelector("[name=valor]").value;
        CashFlow.save(CashFlow(tipo, valor, "foi?"));
    };     
})(window);

function changeWidget(name) { // eslint-disable-line no-unused-vars
    /* 'app' elemento div que contém toda aplicação */
    while (app.firstChild) { //eslint-disable-line no-undef
        app.removeChild(app.firstChild); //eslint-disable-line no-undef
    }
    app.appendChild( // eslint-disable-line no-undef
        window["widget"+name].content.cloneNode(true)
    );
}