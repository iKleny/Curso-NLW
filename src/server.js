//npm -v para testar o node
//node src/server.js para iniciar o server
//npm run dev para ficar rodando o servidor e atualizar automático
//qnd for conter bastante coisas, usar []
//{} usar esse aqui qnd tiver propriedades e para receber objetos
//cache é guardar em memoria alguma coisa pra devolver pra gente mais pra frente
//loop.index com ou sem 0 para n precisar ficar criando várias linhas no html com valores sendo que ele faz isso pelo back-end
//{%for subject in subjects%}  e   {%endfor%}   para enviar informações ao front end pelo back end
//console.log(dados) é ver se está recebendo dados pelo terminal, necessário colocar dentro da function
// != diferente
//localhost e o número da porta para acessar o server criado por mim
//trycatch para pegar erros na hora da execução de banco de dados, console.log(error) dentro
import Database from './database/db.js'
import createProffy from './database/createProffy.js'
const subjects = [
      "Artes",
      "Biologia",
      "Ciências",
      "Educação fisica",    
      "Física",
      "Geografia",
      "Hístoria",
      "Matemática",
      "Português",
      "Química",
  ]
  
const weekdays = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
  ]
  
  //para fazer o value vir em forma de palavras no front-end
function getSubJect (subjectnumber){
      const position = +subjectnumber -1
      return subjects [position]
  }
  
function convertHoursToMinutes(time) {
      const[hour, minutes] = time.split(":")
      return ((hour * 60) + minutes)
  }

function success (req, res) {
       return res.render ("success.html")
}

function pageLanding (req, res) {
      return res.render ("index.html")
}

async function pageStudy (req, res) {
      //para manter as informações usar req.query, e adicionar no html tbm
      const filters = req.query

      //! significa não
      if (!filters.subject || !filters.weekday || !filters.time) {
            return res.render ("study.html", {filters, subjects, weekdays})
      }

      const timeToMinutes = convertHoursToMinutes(filters.time)

      const query = `            
            SELECT classes.*, proffys.*
            FROM proffys
            JOIN classes ON (classes.proffy_id = proffys.id)
            WHERE EXISTS (
                  SELECT class_schedule.*
                  FROM class_schedule
                  WHERE class_schedule.class_id = classes.id
                  AND class_schedule.weekday = ${filters.weekday}
                  AND class_schedule.time_from <= ${timeToMinutes}
                  AND class_schedule.time_to > ${timeToMinutes}
            )
            AND classes.subject = '${filters.subject}'
      `

try {
      const db = await Database
      const proffys = await db.all(query)
      proffys.map((proffy)=>{
            proffy.subject = getSubJect(proffy.subject)
      })
      console.log(proffys)
      return res.render('study.html', {proffys, subjects, filters, weekdays})

} catch (error) {
      console.log(error)
}
      
}

function pageGiveClasses (req, res){


      return res.render ("give-classes.html", {weekdays, subjects})
}

async function saveClasses(req, res) {
      
      const proffyValue = {
            name: req.body.name,
            avatar: req.body.avatar,
            whatsapp: req.body.whatsapp,
            bio: req.body.bio
      }
      const classValue = {
            subject: req.body.subject,
            cost: req.body.cost
      }
      const classScheduleValues = req.body.weekday.map((weekday, index)=> {
            return {
                  weekday,
                  time_from: convertHoursToMinutes(req.body.time_from[index]),
                  time_to: convertHoursToMinutes(req.body.time_to[index])
            }
      })
      
try {
      const db = await Database
      await createProffy(db, {proffyValue, classValue, classScheduleValues})
      let queryString = "?weekday=" + req.body.weekday[0]
      queryString += "&time=" + req.body.time_from[0]
      queryString += "&subject=" + req.body.subject

      //para manter os dados que vão enviar
      //const data = req.body
      //return res.redirect("/success" + queryString)
      
      return res.redirect("/study" + queryString)
      
     
        
      //return res.redirect("/study" + queryString)
      
} catch (error) {
      console.log(error)
}

}
//function qs (req, redirect){return res.redirect("/study" + queryString)}
//servidor
import express from "express";
const server = express()

//configuração nunjucks, primeira coisa a falar é onde está os html para o nunjucks, template engine
import nunjucks from "nunjucks";
nunjucks.configure("src/views", {
      express: server,
      noCache: true,
})
//inicio e configuração do servidor
server
//receber os dados do req.body, é padrão do express n receber esses dados, mas da pra fazer algo a respeito abaixo
.use(express.urlencoded({extended:true}))
//configurar arquivos estáticos (css, scripts, imagens)
.use(express.static("Public"))
//rotas da aplicação 
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.get("/success", success)
.post("/save-classes", saveClasses)
//start do servidor
.listen(5500)