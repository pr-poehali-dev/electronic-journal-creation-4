-- Создание таблиц для электронного журнала

-- Таблица учителей
CREATE TABLE IF NOT EXISTS teachers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    classes TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица учеников
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    class VARCHAR(10) NOT NULL,
    attendance INTEGER DEFAULT 100,
    birth_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица оценок
CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id),
    subject VARCHAR(100) NOT NULL,
    grade INTEGER NOT NULL CHECK (grade >= 2 AND grade <= 5),
    teacher_name VARCHAR(255),
    comment TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица расписания
CREATE TABLE IF NOT EXISTS schedule (
    id SERIAL PRIMARY KEY,
    class_name VARCHAR(10) NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    teacher_name VARCHAR(255) NOT NULL,
    classroom VARCHAR(20) NOT NULL,
    day_of_week INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных - учителя
INSERT INTO teachers (name, subject, classes, status) VALUES
('Иванова Анна Петровна', 'Математика', '9А, 9Б, 10А', 'active'),
('Петрова Мария Сергеевна', 'Русский язык', '8А, 9А, 11Б', 'active'),
('Сидоров Иван Константинович', 'Физика', '9А, 10Б, 11А', 'vacation'),
('Коваленко Наталья Викторовна', 'История', '7А, 8Б, 9А', 'active'),
('Смирнова Ольга Дмитриевна', 'Английский язык', '5А, 6А, 9А', 'active');

-- Вставка начальных данных - ученики
INSERT INTO students (name, class, attendance) VALUES
('Петров Иван', '9А', 98),
('Сидорова Мария', '9А', 95),
('Иванов Алексей', '9Б', 92),
('Козлова Екатерина', '10А', 99),
('Новиков Дмитрий', '10А', 88);

-- Вставка начальных данных - оценки
INSERT INTO grades (student_id, subject, grade, teacher_name, date) VALUES
(1, 'Математика', 5, 'Иванова А.П.', '2026-01-15'),
(1, 'Физика', 5, 'Сидоров И.К.', '2026-01-14'),
(1, 'История', 4, 'Коваленко Н.В.', '2026-01-13'),
(2, 'Математика', 5, 'Иванова А.П.', '2026-01-15'),
(2, 'Русский язык', 4, 'Петрова М.С.', '2026-01-14'),
(3, 'Физика', 4, 'Сидоров И.К.', '2026-01-15'),
(4, 'Математика', 5, 'Иванова А.П.', '2026-01-15'),
(4, 'Английский язык', 5, 'Смирнова О.Д.', '2026-01-14'),
(5, 'История', 4, 'Коваленко Н.В.', '2026-01-13');

-- Вставка начальных данных - расписание для 9А класса
INSERT INTO schedule (class_name, time_slot, subject, teacher_name, classroom) VALUES
('9А', '8:00-8:45', 'Математика', 'Иванова А.П.', '205'),
('9А', '9:00-9:45', 'Русский язык', 'Петрова М.С.', '301'),
('9А', '10:00-10:45', 'Физика', 'Сидоров И.К.', '402'),
('9А', '11:00-11:45', 'История', 'Коваленко Н.В.', '203'),
('9А', '12:00-12:45', 'Английский язык', 'Смирнова О.Д.', '104'),
('9А', '13:00-13:45', 'Физкультура', 'Петров В.И.', 'Спортзал');

-- Создание индексов для производительности
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_grades_student_id ON grades(student_id);
CREATE INDEX IF NOT EXISTS idx_schedule_class ON schedule(class_name);
