import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import Icon from './ui/icon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Teacher {
  id: number;
  name: string;
  subject: string;
  classes: string;
  status: 'active' | 'vacation';
}

interface Student {
  id: number;
  name: string;
  class: string;
  avgGrade: number;
  attendance: number;
}

export default function DirectorDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');

  const teachers: Teacher[] = [
    { id: 1, name: 'Иванова Анна Петровна', subject: 'Математика', classes: '9А, 9Б, 10А', status: 'active' },
    { id: 2, name: 'Петрова Мария Сергеевна', subject: 'Русский язык', classes: '8А, 9А, 11Б', status: 'active' },
    { id: 3, name: 'Сидоров Иван Константинович', subject: 'Физика', classes: '9А, 10Б, 11А', status: 'vacation' },
    { id: 4, name: 'Коваленко Наталья Викторовна', subject: 'История', classes: '7А, 8Б, 9А', status: 'active' },
    { id: 5, name: 'Смирнова Ольга Дмитриевна', subject: 'Английский язык', classes: '5А, 6А, 9А', status: 'active' },
  ];

  const students: Student[] = [
    { id: 1, name: 'Петров Иван', class: '9А', avgGrade: 4.8, attendance: 98 },
    { id: 2, name: 'Сидорова Мария', class: '9А', avgGrade: 4.6, attendance: 95 },
    { id: 3, name: 'Иванов Алексей', class: '9Б', avgGrade: 4.2, attendance: 92 },
    { id: 4, name: 'Козлова Екатерина', class: '10А', avgGrade: 4.9, attendance: 99 },
    { id: 5, name: 'Новиков Дмитрий', class: '10А', avgGrade: 4.1, attendance: 88 },
  ];

  const gradeData = [
    { subject: 'Математика', avgGrade: 4.2 },
    { subject: 'Русский', avgGrade: 4.5 },
    { subject: 'Физика', avgGrade: 4.1 },
    { subject: 'История', avgGrade: 4.4 },
    { subject: 'Английский', avgGrade: 4.3 },
    { subject: 'Химия', avgGrade: 4.0 },
  ];

  const attendanceData = [
    { month: 'Сен', value: 96 },
    { month: 'Окт', value: 94 },
    { month: 'Ноя', value: 95 },
    { month: 'Дек', value: 97 },
  ];

  const classDistribution = [
    { name: '5-6 классы', value: 120, color: '#4F46E5' },
    { name: '7-8 классы', value: 150, color: '#8B5CF6' },
    { name: '9-11 классы', value: 110, color: '#0EA5E9' },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-card/50 backdrop-blur-xl border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                <Icon name="Shield" className="text-white" size={20} />
              </div>
              <div>
                <h2 className="font-semibold">Панель директора</h2>
                <p className="text-sm text-muted-foreground">Управление школой</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              Учеников: 380
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-2">
            <TabsTrigger value="analytics" className="gap-2">
              <Icon name="BarChart3" size={16} />
              <span className="hidden sm:inline">Аналитика</span>
            </TabsTrigger>
            <TabsTrigger value="teachers" className="gap-2">
              <Icon name="Users" size={16} />
              <span className="hidden sm:inline">Учителя</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="gap-2">
              <Icon name="GraduationCap" size={16} />
              <span className="hidden sm:inline">Ученики</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="gap-2">
              <Icon name="Calendar" size={16} />
              <span className="hidden sm:inline">Расписание</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6 animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon name="Users" className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Всего учеников</p>
                    <p className="text-2xl font-bold">380</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                    <Icon name="BookOpen" className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Учителей</p>
                    <p className="text-2xl font-bold">45</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Icon name="TrendingUp" className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Средний балл</p>
                    <p className="text-2xl font-bold">4.3</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Icon name="CheckCircle" className="text-blue-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Посещаемость</p>
                    <p className="text-2xl font-bold">95%</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Средние оценки по предметам</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={gradeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="subject" className="text-xs" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="avgGrade" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Посещаемость по месяцам</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            <Card className="p-6">
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Распределение учеников по классам</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={classDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {classDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col justify-center space-y-4">
                  {classDistribution.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Управление учителями</h3>
                <Button className="gap-2">
                  <Icon name="UserPlus" size={16} />
                  Добавить учителя
                </Button>
              </div>
              <div className="mb-4">
                <Input placeholder="Поиск учителей..." className="max-w-md" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ФИО</TableHead>
                    <TableHead>Предмет</TableHead>
                    <TableHead>Классы</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.subject}</TableCell>
                      <TableCell>{teacher.classes}</TableCell>
                      <TableCell>
                        <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                          {teacher.status === 'active' ? 'Активен' : 'В отпуске'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Icon name="Edit" size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="students" className="animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Список учеников</h3>
                <Button className="gap-2">
                  <Icon name="UserPlus" size={16} />
                  Добавить ученика
                </Button>
              </div>
              <div className="mb-4">
                <Input placeholder="Поиск учеников..." className="max-w-md" />
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ФИО</TableHead>
                    <TableHead>Класс</TableHead>
                    <TableHead>Средний балл</TableHead>
                    <TableHead>Посещаемость</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <Badge variant={student.avgGrade >= 4.5 ? 'default' : 'secondary'}>
                          {student.avgGrade.toFixed(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.attendance}%</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Icon name="Eye" size={16} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Icon name="Edit" size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="animate-fade-in">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Управление расписанием</h3>
                <Button className="gap-2">
                  <Icon name="Plus" size={16} />
                  Создать расписание
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {['9А', '9Б', '10А', '10Б', '11А', '11Б'].map((className) => (
                  <Card key={className} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">Класс {className}</h4>
                      <Icon name="Calendar" size={20} className="text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">6 уроков в день</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon name="Eye" size={14} className="mr-1" />
                        Просмотр
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Icon name="Edit" size={14} className="mr-1" />
                        Редактировать
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}