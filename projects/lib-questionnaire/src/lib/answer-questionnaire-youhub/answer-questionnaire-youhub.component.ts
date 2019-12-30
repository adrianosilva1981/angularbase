import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'lib-questionnaire-answer-questionnaire-youhub',
  templateUrl: './answer-questionnaire-youhub.component.html',
  styleUrls: ['./answer-questionnaire-youhub.component.less']
})
export class AnswerQuestionnaireYouhubComponent implements OnInit {

  @Input() id: string;
  @Input() type: string;
  @Input() relation: string;
  @Input() id_user: string;
  @Input() idMail: string;
  @Output() finish = new EventEmitter();
  @Output() message = new EventEmitter();

  public questionnaire = null;
  public listQuestions = [];
  public position = 0;
  public options;
  public answerValue = null;
  public allAnswers = [];
  public justifyAnswer = null;
  public updateJustifyAnswer = null;

  public review = false;
  public edit = false;
  public editQuestion: any;
  public editAnswer: any;
  public editOptions;
  public editIndex;

  public alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W',
    'X', 'Y', 'Z'];

  constructor(
    private _sharedService: SharedService
  ) { }

  ngOnInit() {
    this.verifyQuestionarie();
  }

  verifyQuestionarie() {
    this._sharedService.verifyQuestionnaire(this.id, this.type, this.relation).subscribe(
      response => {
        if (response.return) {
          if (response.data !== '') {
            this.questionnaire = response.data;
            this.questionnaire.type = this.type;
            this.questionnaire.id = this.id;
            this.getAllQuiz(this.questionnaire.id_questionnaire);
          } else {
            this.sendMenssage('Atenção', response.msg, 'warn');
            this.finalize();
          }
        } else {
          this.sendMenssage('Atenção', response.msg, 'warn');
          this.finalize();
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  getAllQuiz(id_questionnaire) {
    this._sharedService.getAllQuiz(id_questionnaire).subscribe(
      response => {
        if (response.return) {
          if (response.data === '') {
            this.sendMenssage('Atenção', response.msg, 'warn');
            this.finalize();
          } else {
            this.listQuestions = response.data;
            this.listQuestions.map(element => element.typeDescription = '');
            this.options = new Array(response.data.length);
            if (this.listQuestions[this.position].typeItem !== 'answer') {
              this.getQuizDetails(this.listQuestions[this.position].id, this.position);
            }
          }
        } else {
          this.sendMenssage('Atenção', response.msg, 'warn');
          this.finalize();
        }
      },
      err => {
        //this._toastrService.error(err, 'Falha');
        this.sendMenssage('Falha', err, 'error');
      }
    );
  }

  getQuizDetails(id_quiz, position) {
    this._sharedService.getQuizDetails(id_quiz).subscribe(
      response => {
        if (response.return) {
          this.options[this.position] = response.data;
          this.listQuestions[position].typeDescription = response.data[0].typeDescription;
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  setAnswerCheckBox(value, event) {
    if (this.answerValue === null) {
      this.answerValue = [];
    }
    if (event) {
      const item = this.answerValue.find(x => x === value);
      if (!item) {
        this.answerValue.push(value);
      }
    } else {
      this.answerValue = this.answerValue.filter(function (item) {
        return item !== value;
      });
    }
  }

  sendAnswers() {
    const objSend = {
      answers: this.allAnswers,
      type: this.type,
      id_user: this.id_user,
      relation: this.relation,
      idMail: this.idMail
    };

    this._sharedService.sendAnswers(objSend).subscribe(
      response => {
        if (response.return) {
          // this._toastrService.success(response.msg, 'Sucesso');
          this.sendMenssage('Sucesso', response.msg, 'success');
          this.finalize();
        } else {
          //this._toastrService.warning(response.msg, 'Atenção');
          this.sendMenssage('Atenção', response.msg, 'warn');
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  answer() {
    if (this.listQuestions[this.position].typeItem === 'justifyOption') {
      if (this.answerValue) {

        if (this.options[this.position][0].id_quizItem !== this.answerValue && !this.justifyAnswer) {
          this.sendMenssage('Atenção', 'Descrição não pode ser vazia', 'warn');
        } else {
          const item = this.options[this.position].find(x => x.id_quizItem === this.answerValue);
          const text = item.question + ' | Descrição: ' + (this.justifyAnswer !== null ? this.justifyAnswer : '');
          const objInsert = {
            id_quiz: this.listQuestions[this.position].id,
            answer: this.answerValue,
            description: text
          };
          // adicionamos o objeto na lista de todas as respostas
          this.allAnswers[this.position] = objInsert;
          this.answerValue = null;
          this.justifyAnswer = null;
          // verificamos se foram respondidas todas as questões
          if (this.position + 1 >= this.listQuestions.length) {
            this.review = true;
          } else {
            this.position++;
            if (this.listQuestions[this.position].typeItem !== 'answer') {
              this.getQuizDetails(this.listQuestions[this.position].id, this.position);
            }
          }
        }
      } else {
        // this._toastrService.warning('Resposta não pode ser vazia', 'Atenção');
        this.sendMenssage('Atenção', 'Resposta e descrição não pode ser vazia', 'warn');
      }
    } else
      if (this.listQuestions[this.position].typeItem === 'justifySelection') {
        if (this.answerValue) {
          const exist = this.answerValue.filter(element => this.options[this.position][this.options[this.position].length - 1].id_quizItem === element);
          if (exist.length > 0 && !this.justifyAnswer) {
            //this._toastrService.warning('Resposta não pode ser vazia', 'Atenção');
            this.sendMenssage('Atenção', 'Descrição não pode ser vazia', 'warn');
          } else {

            let text = '';
            this.answerValue.forEach(element => {
              const item = this.options[this.position].find(x => x.id_quizItem === element);
              text += item.question;
              text += ', ';
            });

            text += ' | Descrição: ' + (this.justifyAnswer !== null ? this.justifyAnswer : '');


            const objInsert = {
              id_quiz: this.listQuestions[this.position].id,
              answer: this.answerValue,
              description: text
            };
            // adicionamos o objeto na lista de todas as respostas
            this.allAnswers[this.position] = objInsert;
            this.answerValue = null;
            this.justifyAnswer = null;
            // verificamos se foram respondidas todas as questões
            if (this.position + 1 >= this.listQuestions.length) {
              this.review = true;
            } else {
              this.position++;
              if (this.listQuestions[this.position].typeItem !== 'answer') {
                this.getQuizDetails(this.listQuestions[this.position].id, this.position);
              }
            }
          }
        } else {
          //this._toastrService.warning('Resposta não pode ser vazia', 'Atenção');
          this.sendMenssage('Atenção', 'Resposta não pode ser vazia', 'warn');
        }
      } else {
        if (this.answerValue) {
          let text = '';
          // pegamos a descrição da resposta
          switch (this.listQuestions[this.position].typeItem) {
            case 'option':
              const item = this.options[this.position].find(x => x.id_quizItem === this.answerValue);
              text = item.question;
              break;
            case 'selection':
              this.answerValue.forEach(element => {
                const item = this.options[this.position].find(x => x.id_quizItem === element);
                text += item.question;
                text += ', ';
              });
              break;
            default:
              text = this.answerValue;
              break;
          }
          // criamos o objeto
          const objInsert = {
            id_quiz: this.listQuestions[this.position].id,
            answer: this.answerValue,
            description: text
          };
          // adicionamos o objeto na lista de todas as respostas
          this.allAnswers[this.position] = objInsert;
          this.answerValue = null;
          // verificamos se foram respondidas todas as questões
          if (this.position + 1 >= this.listQuestions.length) {
            this.review = true;
          } else {
            this.position++;
            if (this.listQuestions[this.position].typeItem !== 'answer') {
              this.getQuizDetails(this.listQuestions[this.position].id, this.position);
            }
          }
        } else {
          // this._toastrService.warning('Resposta não pode ser vazia', 'Atenção');
          this.sendMenssage('Atenção', 'Resposta não pode ser vazia', 'warn');
        }
      }
  }

  showEdit(index) {
    this.edit = true;
    this.editIndex = index;
    this.editQuestion = this.listQuestions[index];
    this.editOptions = this.options[index];
    this.editAnswer = this.allAnswers[index];
    this.answerValue = this.editAnswer.answer;

    const asn = this.editAnswer.description.split('Descrição: ');
    if (asn.length > 1) {
      this.justifyAnswer = asn[1];
    } else {
      this.justifyAnswer = '';
    }

    this.justifyAnswer = this.justifyAnswer !== 'null' ? this.justifyAnswer : '';
  }

  verifyAnswer(value) {
    const item = this.editAnswer.answer.find(x => x === value);
    return item;
  }

  updateAnswer() {
    if (this.listQuestions[this.editIndex].typeItem === 'justifyOption') {
      if (this.answerValue && this.answerValue !== '' && this.answerValue.length > 0 && this.justifyAnswer) {
        const item = this.options[this.editIndex].find(x => x.id_quizItem === this.answerValue);
        const text = item.question + ' | Descrição: ' + this.justifyAnswer;

        this.allAnswers[this.editIndex].answer = this.answerValue;
        this.allAnswers[this.editIndex].description = text;
      } else {
        // this._toastrService.warning('Resposta não pode ser vazia', 'Atenção');
        this.sendMenssage('Atenção', 'Resposta e descrição não pode ser vazia', 'warn');
      }
    } else if (this.listQuestions[this.editIndex].typeItem === 'justifySelection') {
      if (this.answerValue) {
        if (this.options[this.editIndex][this.options[this.editIndex].length - 1].id_quizItem === this.answerValue && !this.justifyAnswer) {
          // this._toastrService.warning('Resposta não pode ser vazia', 'Atenção');
          this.sendMenssage('Atenção', 'Descrição não pode ser vazia', 'warn');
        } else {
          const item = this.options[this.editIndex].find(x => x.id_quizItem === this.answerValue);
          const text = item.question + ' | Descrição: ' + this.justifyAnswer;

          this.allAnswers[this.editIndex].answer = this.answerValue;
          this.allAnswers[this.editIndex].description = text;
        }
      } else {
        // this._toastrService.warning('Resposta não pode ser vazia', 'Atenção');
        this.sendMenssage('Atenção', 'Resposta não pode ser vazia', 'warn');
      }
    } else {
      if (this.answerValue && this.answerValue !== '' && this.answerValue.length > 0) {
        let text = '';
        // procuramos pelo texto das respostas de multipla escolha
        switch (this.listQuestions[this.editIndex].typeItem) {
          case 'option':
            // so uma
            const item = this.options[this.editIndex].find(x => x.id_quizItem === this.answerValue);
            text = item.question;
            break;
          case 'selection':
            // mais de uma
            this.answerValue.forEach(element => {
              const item = this.options[this.editIndex].find(x => x.id_quizItem === element);
              text += item.question;
              text += ', ';
            });
            break;
          default:
            text = this.answerValue;
            break;
        }
        this.allAnswers[this.editIndex].answer = this.answerValue;
        this.allAnswers[this.editIndex].description = text;
      } else {
        //this._toastrService.warning('Resposta não pode ser vazia', 'Atenção');
        this.sendMenssage('Atenção', 'Resposta não pode ser vazia', 'warn');
      }
    }
    this.edit = false;
  }

  finalize() {
    this.finish.emit(true);
  }

  sendMenssage(title, msg, type) {
    const obj = {
      title: title,
      message: msg,
      type: type
    };

    this.message.emit(obj);
  }
}
