import { useState } from 'react';
import StudentDashboard from '@/components/StudentDashboard';
import DirectorDashboard from '@/components/DirectorDashboard';
import { Button } from '@/components/ui/button';

type UserRole = 'student' | 'director' | null;

const Index = () => {
  const [role, setRole] = useState<UserRole>(null);

  if (!role) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 animate-scale-in">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Электронный журнал
            </h1>
            <p className="text-muted-foreground">Выберите роль для входа</p>
          </div>
          <div className="bg-card rounded-2xl shadow-xl border p-8 space-y-4">
            <Button
              onClick={() => setRole('student')}
              className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
              size="lg"
            >
              Ученик / Учитель
            </Button>
            <Button
              onClick={() => setRole('director')}
              className="w-full h-14 text-lg"
              variant="outline"
              size="lg"
            >
              Директор
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="absolute top-4 right-4 z-50">
        <Button onClick={() => setRole(null)} variant="outline" size="sm">
          Выйти
        </Button>
      </div>
      {role === 'student' ? <StudentDashboard /> : <DirectorDashboard />}
    </div>
  );
};

export default Index;