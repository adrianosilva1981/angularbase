# Aplicação //////////////////////////////////////////////////////

#### Comandos
- Executar aplicações.
>`ng serve app-NOME`

- Buildar uma aplicação para produção.
>`ng build --prod app-NOME`

- Buildar uma bibliotecang
>`ng build lib-NOME`

- Buildar todas as bibliotecas (Sempre buildar todas as bibliotecas quando dar um npm install)
>`npm run build-all-libs`

- Criar uma nova aplicação.
>`ng generate application app-NOME --prefix app-NOME`

- Criar um novo componente para uma determinada aplicação
>`ng generate component NOME --project=PROJETO`

#### Observações
1. O nome e o prefixo da aplicaçãp devera seguir a seguinte nomenclatura:  `app-NOME --prefix app-NOME`
2. Toda vez que criar uma aplicação que irá utilizar a navbar padrão criar um componente na biblioteca `lib-navbar` com o nome da aplicação EX.: `ng g c /components/NOME_DA_APLICAÇÂO`
3. Colocar no app.componente principal da aplicação a inscrição no evento `listenerLoginComponent` para redirecionar para o local desejado.
```javascript
BroadcastEventService.event('listenerLoginComponent').subscribe(
    userData => {
        this._router.navigate(['/']);
    }
);
```

4. Colocar no app.componente principal da aplicação a emissão do evendo `onApplicationName` como o nome da aplicação EX.: app-playground

```javascript
this._router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
    setTimeout(() => {
        BroadcastEventService.event('onApplicationName').emit({
        name: 'app-playground',
        group: 'to-hire' //default | to-work | to-hire | consultant
        });
    }, 100);
    }
});
```

5. Quando criar uma nova aplicação atualizar o arquivo `angular.json` seguinte forma

```javascript
//Mudar o caminho do build
"outputPath": "dist",
// *********************************************************************************
//Adicionar a linha da pasta global
"assets": [
    "projects/app-consultant-adm/src/favicon.ico",
    "projects/app-consultant-adm/src/assets",
    { "glob": "**/*", "input": "./global", "output": "/global/" }//<----ESTA LINHA
],
// *********************************************************************************
//Adicionar o style global
"styles": [
    "global/css/global-styles.less", //<----ESTA LINHA
    "projects/app-consultant-adm/src/styles.less"
],
// *********************************************************************************
//Adicionar o stylePreprocessorOptions logo abaixo do 'styles'
"stylePreprocessorOptions": {
    "includePaths": [
    "global"
    ]
}
```

6. O serviço de mensagem utilizado é do primeng entao é necessário importa-lo no modulo principal

```javascript
//No app.module.ts
import {GrowlModule} from 'primeng/growl';
...
imports: [
    ...,
    GrowlModule
]
//No app.component.html logo abaixo do router-outlet
```
```xml
<p-growl></p-growl>
<router-outlet></router-outlet>
```

7. Colocar o enviromment no providers da seguinte forma:

```javascript
providers: [
    { provide: 'environments', useValue: environment }
],
```

8. Colocar no arquivo tsconfig.json o apelido correspondente a aplicação criada dentro do paths

```javascript
...
,
      "@app-NOME/*": [
        "projects/app-NOME/src/app/*"
      ]
```

9. Trocar a extenção do app.component.css para .less

```javascript
styleUrls: ['./app.component.less']
```

10. Enviromment no minimo estas duas.
>`apiPhp:'url'`
>`apiPhpV2:'url'`

11. Página not-found utilizar nas rotas a da biblioteca `lib-components`.
```javascript
import { NotFoundComponent } from 'lib-components';
```

12. Sempre quando for utilizar o modal do material angular, inserir a classe `globalModalHJ` como parametro pois ja esta formatado no `global-style.less`.
```javascript
const dialogRef = this._dialog.open(ContactProfessionalComponent, {
    data: this.objProfessional,
    panelClass: 'globalModalHJ'
});
```
  

# Biblioteca //////////////////////////////////////////////////////

#### Comandos
- Criar uma nova biblioteca
>`ng generate library lib-NOME --prefix lib-NOME`

#### Observações
1. O nome e o prefixo da aplicação devera seguir a seguinte nomenclatra:  `app-NOME --prefix app-NOME`

2. Editar o arquivo `tsconfig.json`

```javascript
{
    "lib-chat": [
        "dist/lib-chat",
        "node_modules/lib-chat" //<---- Esta linha
    ],
    "lib-chat/*": [
        "dist/lib-chat/*",
        "node_modules/lib-chat" //<---- Esta linha
    ]
}
```

3. Mudar o caminho dos arquivos `ng-package.json` e `ng-package.prod.json`

```javascript
{
    "dest": "../../node_modules/lib-chat"
}
```



# Universal //////////////////////////////////////////////////////

#### Comandos
- Associar o projeto que vai ser universal
>`ng generate universal --client-project PROJETO`

- Atualizar a variável `%npm_package_config_project%` no package.json
> `npm config set global-hyper-jobs:project=PROJETO`

- Buildar para produção
>`build-PROJETO`


#### Observações
1. Na raiz cria o server.ts e webpack.server.config.js(copiar prontos)

2. Instalar bibliotecas para que funcione o universal
>`npm install --save @angular/platform-server @nguniversal/module-map-ngfactory-loader ts-loader @nguniversal/express-engine`

3. Alterar o angular.json o `outputPath` no no build e no server
```javascript
"outputPath": "dist/browser",
...
"outputPath": "dist/server",
```

4. Apos cria um projeto adicionar o script de build para o mesmo no **package.json**
```javascript
"build-app-universal":"npm config set global-hyper-jobs:project=NOME_DO_PROJETO && npm run build:ssr"
```

5. Inserir os scripts de build
```javascript
"build:ssr": "npm run build:client-and-server-bundles && npm run webpack:server && node dist/server",
"build:client-and-server-bundles": "ng build NOME-DA-APLICACAO --prod && ng run NOME-DA-APLICACAO:server",
"webpack:server": "webpack --config webpack.server.config.js --progress --colors"
```

6. Remover o baseUrl do arquivo `tsconfig.server.json` da aplicação
```javascript
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "outDir": "../../out-tsc/app-server",
    "baseUrl": ".", // <---------------------------REMOVER ESTA LINHA
    "module": "commonjs"
  },
  "angularCompilerOptions": {
    "entryModule": "src/app/app.server.module#AppServerModule"
  }
}
```
