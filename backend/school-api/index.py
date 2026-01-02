import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    """Создание подключения к базе данных"""
    return psycopg2.connect(
        os.environ['DATABASE_URL'],
        cursor_factory=RealDictCursor
    )

def handler(event: dict, context) -> dict:
    """
    API для управления школой: учителя, ученики, оценки, расписание
    """
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    path = event.get('queryStringParameters', {}).get('action', '')
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        if method == 'GET':
            if path == 'teachers':
                result = get_teachers(cursor)
            elif path == 'students':
                result = get_students(cursor)
            elif path == 'grades':
                student_id = event.get('queryStringParameters', {}).get('student_id')
                result = get_grades(cursor, student_id)
            elif path == 'schedule':
                class_name = event.get('queryStringParameters', {}).get('class_name')
                result = get_schedule(cursor, class_name)
            elif path == 'analytics':
                result = get_analytics(cursor)
            else:
                result = {'error': 'Unknown action'}
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'teacher':
                result = add_teacher(conn, cursor, body)
            elif path == 'student':
                result = add_student(conn, cursor, body)
            elif path == 'grade':
                result = add_grade(conn, cursor, body)
            elif path == 'schedule':
                result = add_schedule(conn, cursor, body)
            else:
                result = {'error': 'Unknown action'}
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            
            if path == 'teacher':
                result = update_teacher(conn, cursor, body)
            elif path == 'student':
                result = update_student(conn, cursor, body)
            else:
                result = {'error': 'Unknown action'}
        
        elif method == 'DELETE':
            item_id = event.get('queryStringParameters', {}).get('id')
            
            if path == 'teacher':
                result = delete_teacher(conn, cursor, item_id)
            elif path == 'student':
                result = delete_student(conn, cursor, item_id)
            else:
                result = {'error': 'Unknown action'}
        
        else:
            result = {'error': 'Method not allowed'}
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, default=str)
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }

def get_teachers(cursor):
    """Получить список учителей"""
    cursor.execute('SELECT * FROM teachers ORDER BY name')
    return {'teachers': cursor.fetchall()}

def get_students(cursor):
    """Получить список учеников с их средним баллом"""
    cursor.execute('''
        SELECT 
            s.*,
            COALESCE(AVG(g.grade), 0) as avg_grade
        FROM students s
        LEFT JOIN grades g ON s.id = g.student_id
        GROUP BY s.id
        ORDER BY s.class, s.name
    ''')
    return {'students': cursor.fetchall()}

def get_grades(cursor, student_id=None):
    """Получить оценки (все или конкретного ученика)"""
    if student_id:
        cursor.execute('''
            SELECT g.*, s.name as student_name, s.class
            FROM grades g
            JOIN students s ON g.student_id = s.id
            WHERE g.student_id = %s
            ORDER BY g.date DESC
        ''', (student_id,))
    else:
        cursor.execute('''
            SELECT g.*, s.name as student_name, s.class
            FROM grades g
            JOIN students s ON g.student_id = s.id
            ORDER BY g.date DESC
            LIMIT 100
        ''')
    return {'grades': cursor.fetchall()}

def get_schedule(cursor, class_name=None):
    """Получить расписание (все или конкретного класса)"""
    if class_name:
        cursor.execute('''
            SELECT * FROM schedule 
            WHERE class_name = %s 
            ORDER BY time_slot
        ''', (class_name,))
    else:
        cursor.execute('SELECT * FROM schedule ORDER BY class_name, time_slot')
    return {'schedule': cursor.fetchall()}

def get_analytics(cursor):
    """Получить аналитику"""
    cursor.execute('SELECT COUNT(*) as total FROM students')
    total_students = cursor.fetchone()['total']
    
    cursor.execute('SELECT COUNT(*) as total FROM teachers')
    total_teachers = cursor.fetchone()['total']
    
    cursor.execute('SELECT AVG(grade) as avg FROM grades')
    avg_grade = cursor.fetchone()['avg'] or 0
    
    cursor.execute('SELECT AVG(attendance) as avg FROM students')
    avg_attendance = cursor.fetchone()['avg'] or 0
    
    cursor.execute('''
        SELECT subject, AVG(grade) as avg_grade 
        FROM grades 
        GROUP BY subject 
        ORDER BY subject
    ''')
    grades_by_subject = cursor.fetchall()
    
    return {
        'total_students': total_students,
        'total_teachers': total_teachers,
        'avg_grade': float(avg_grade),
        'avg_attendance': float(avg_attendance),
        'grades_by_subject': grades_by_subject
    }

def add_teacher(conn, cursor, data):
    """Добавить учителя"""
    cursor.execute('''
        INSERT INTO teachers (name, subject, classes, status)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    ''', (data['name'], data['subject'], data.get('classes', ''), data.get('status', 'active')))
    conn.commit()
    return {'success': True, 'id': cursor.fetchone()['id']}

def add_student(conn, cursor, data):
    """Добавить ученика"""
    cursor.execute('''
        INSERT INTO students (name, class, attendance, birth_date)
        VALUES (%s, %s, %s, %s)
        RETURNING id
    ''', (data['name'], data['class'], data.get('attendance', 100), data.get('birth_date')))
    conn.commit()
    return {'success': True, 'id': cursor.fetchone()['id']}

def add_grade(conn, cursor, data):
    """Добавить оценку"""
    cursor.execute('''
        INSERT INTO grades (student_id, subject, grade, teacher_name, comment, date)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    ''', (
        data['student_id'], 
        data['subject'], 
        data['grade'], 
        data.get('teacher_name', ''),
        data.get('comment', ''),
        data.get('date', datetime.now().date())
    ))
    conn.commit()
    return {'success': True, 'id': cursor.fetchone()['id']}

def add_schedule(conn, cursor, data):
    """Добавить урок в расписание"""
    cursor.execute('''
        INSERT INTO schedule (class_name, time_slot, subject, teacher_name, classroom)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    ''', (
        data['class_name'],
        data['time_slot'],
        data['subject'],
        data['teacher_name'],
        data['classroom']
    ))
    conn.commit()
    return {'success': True, 'id': cursor.fetchone()['id']}

def update_teacher(conn, cursor, data):
    """Обновить данные учителя"""
    cursor.execute('''
        UPDATE teachers 
        SET name = %s, subject = %s, classes = %s, status = %s
        WHERE id = %s
    ''', (data['name'], data['subject'], data['classes'], data['status'], data['id']))
    conn.commit()
    return {'success': True}

def update_student(conn, cursor, data):
    """Обновить данные ученика"""
    cursor.execute('''
        UPDATE students 
        SET name = %s, class = %s, attendance = %s
        WHERE id = %s
    ''', (data['name'], data['class'], data['attendance'], data['id']))
    conn.commit()
    return {'success': True}

def delete_teacher(conn, cursor, teacher_id):
    """Удалить учителя"""
    cursor.execute('UPDATE teachers SET status = %s WHERE id = %s', ('deleted', teacher_id))
    conn.commit()
    return {'success': True}

def delete_student(conn, cursor, student_id):
    """Архивировать ученика (мягкое удаление)"""
    cursor.execute('UPDATE students SET class = %s WHERE id = %s', ('Архив', student_id))
    conn.commit()
    return {'success': True}
