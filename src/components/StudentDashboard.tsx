import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import Icon from './ui/icon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ScrollArea } from './ui/scroll-area';

interface Grade {
  subject: string;
  grade: number;
  date: string;
  type: string;
}

interface Schedule {
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

interface Homework {
  subject: string;
  task: string;
  deadline: string;
  completed: boolean;
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  const grades: Grade[] = [
    { subject: 'Математика', grade: 5, date: '28.12', type: 'Контрольная' },
    { subject: 'Русский язык', grade: 4, date: '27.12', type: 'Диктант' },
    { subject: 'Физика', grade: 5, date: '26.12', type: 'Лабораторная' },
    { subject: 'История', grade: 4, date: '25.12', type: 'Тест' },
    { subject: 'Английский', grade: 5, date: '24.12', type: 'Устный ответ' },
  ];

  const schedule: Schedule[] = [
    { time: '08:30', subject: 'Математика', teacher: 'Иванова А.П.', room: '204' },
    { time: '09:30', subject: 'Русский язык', teacher: 'Петрова М.С.', room: '301' },
    { time: '10:40', subject: 'Физика', teacher: 'Сидоров И.К.', room: '105' },
    { time: '11:50', subject: 'История', teacher: 'Коваленко Н.В.', room: '412' },
    { time: '13:00', subject: 'Английский', teacher: 'Смирнова О.Д.', room: '208' },
  ];

  const homework: Homework[] = [
    { subject: 'Математика', task: 'Решить задачи № 456-460, повторить формулы', deadline: '03.01', completed: false },
    { subject: 'Физика', task: 'Подготовить лабораторную работу по теме "Электричество"', deadline: '05.01', completed: false },
    { subject: 'Русский язык', task: 'Написать сочинение на тему "Зима"', deadline: '04.01', completed: true },
    { subject: 'История', task: 'Читать параграф 15, ответить на вопросы', deadline: '06.01', completed: false },
  ];

  const averageGrade = (grades.reduce((acc, g) => acc + g.grade, 0) / grades.length).toFixed(1);

  return (
    <div className="min-h-screen">
      <header className="bg-card/50 backdrop-blur-xl border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Icon name="User" className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Иван Петров</h2>
                <p className="text-sm text-muted-foreground">Ученик 9А класса</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Средний балл: {averageGrade}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
            <TabsTrigger value="home" className="gap-2">
              <Icon name="Home" size={16} />
              <span className="hidden sm:inline">Главная</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Icon name="Calendar" size={16} />
              <span className="hidden sm:inline">Расписание</span>
            </TabsTrigger>
            <TabsTrigger value="homework" className="gap-2">
              <Icon name="BookOpen" size={16} />
              <span className="hidden sm:inline">Домашнее задание</span>
            </TabsTrigger>
            <TabsTrigger value="grades" className="gap-2">
              <Icon name="TrendingUp" size={16} />
              <span className="hidden sm:inline">Оценки</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="gap-2">
              <Icon name="FileText" size={16} />
              <span className="hidden sm:inline">Документы</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <Icon name="MessageSquare" size={16} />
              <span className="hidden sm:inline">Сообщения</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon name="TrendingUp" className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Средний балл</p>
                    <p className="text-2xl font-bold">{averageGrade}</p>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon name="BookOpen" className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Заданий</p>
                    <p className="text-2xl font-bold">{homework.filter(h => !h.completed).length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Icon name="CheckCircle" className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Выполнено</p>
                    <p className="text-2xl font-bold">{homework.filter(h => h.completed).length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Icon name="MessageSquare" className="text-orange-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Уведомлений</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Сегодняшнее расписание
                </h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {schedule.map((lesson, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="text-sm font-medium text-muted-foreground min-w-[50px]">
                          {lesson.time}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{lesson.subject}</p>
                          <p className="text-sm text-muted-foreground">{lesson.teacher}</p>
                        </div>
                        <Badge variant="outline">{lesson.room}</Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Icon name="BookOpen" size={20} />
                  Ближайшие задания
                </h3>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {homework.map((hw, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${hw.completed ? 'bg-green-50/50 border-green-200' : 'bg-card'}`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="font-semibold">{hw.subject}</p>
                          <Badge variant={hw.completed ? "default" : "secondary"} className="text-xs">
                            до {hw.deadline}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{hw.task}</p>
                        {hw.completed && (
                          <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
                            <Icon name="CheckCircle" size={14} />
                            <span>Выполнено</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">Расписание на неделю</h3>
              <div className="space-y-4">
                {schedule.map((lesson, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="w-20 text-center">
                      <p className="text-lg font-bold">{lesson.time}</p>
                    </div>
                    <div className="w-px h-12 bg-border" />
                    <div className="flex-1">
                      <p className="text-lg font-semibold">{lesson.subject}</p>
                      <p className="text-muted-foreground">{lesson.teacher}</p>
                    </div>
                    <Badge variant="outline" className="text-base px-4 py-1">
                      Кабинет {lesson.room}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="homework" className="animate-fade-in">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">Домашние задания</h3>
              <div className="space-y-4">
                {homework.map((hw, idx) => (
                  <div key={idx} className={`p-6 rounded-xl border-2 ${hw.completed ? 'border-green-200 bg-green-50/50' : 'border-border'}`}>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold mb-1">{hw.subject}</h4>
                        <p className="text-muted-foreground">{hw.task}</p>
                      </div>
                      <Badge variant={hw.completed ? "default" : "secondary"} className="text-sm px-3 py-1">
                        Срок: {hw.deadline}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <Button variant={hw.completed ? "outline" : "default"} size="sm">
                        {hw.completed ? (
                          <><Icon name="CheckCircle" size={16} className="mr-2" /> Выполнено</>
                        ) : (
                          <><Icon name="Upload" size={16} className="mr-2" /> Отправить работу</>
                        )}
                      </Button>
                      {!hw.completed && (
                        <Progress value={0} className="w-32" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="animate-fade-in">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">Последние оценки</h3>
              <div className="space-y-3">
                {grades.map((grade, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
                        grade.grade === 5 ? 'bg-green-100 text-green-700' : 
                        grade.grade === 4 ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {grade.grade}
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{grade.subject}</p>
                        <p className="text-sm text-muted-foreground">{grade.type}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">{grade.date}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="animate-fade-in">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">Документы и справки</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { name: 'Справка об обучении', date: '15.12.2024', icon: 'FileText' },
                  { name: 'Медицинская справка', date: '01.09.2024', icon: 'Heart' },
                  { name: 'Характеристика', date: '20.11.2024', icon: 'Award' },
                  { name: 'Расписание экзаменов', date: '10.12.2024', icon: 'Calendar' },
                ].map((doc, idx) => (
                  <div key={idx} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon name={doc.icon as any} size={20} className="text-primary" />
                      <p className="font-semibold">{doc.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Дата: {doc.date}</p>
                    <Button variant="link" className="px-0 mt-2">
                      Скачать <Icon name="Download" size={14} className="ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="animate-fade-in">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-6">Сообщения и уведомления</h3>
              <div className="space-y-3">
                {[
                  { from: 'Иванова А.П.', subject: 'Контрольная работа', text: 'Напоминаю о контрольной работе в пятницу', time: '2 часа назад', unread: true },
                  { from: 'Администрация', subject: 'Каникулы', text: 'График работы школы на каникулах', time: '5 часов назад', unread: true },
                  { from: 'Петрова М.С.', subject: 'Домашнее задание', text: 'Изменения в домашнем задании', time: 'Вчера', unread: false },
                  { from: 'Классный руководитель', subject: 'Родительское собрание', text: 'Приглашение на собрание 15 января', time: '2 дня назад', unread: false },
                ].map((msg, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer ${msg.unread ? 'bg-primary/5 border-primary/20' : ''}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{msg.from}</p>
                          {msg.unread && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">{msg.subject}</p>
                        <p className="text-sm text-muted-foreground">{msg.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
