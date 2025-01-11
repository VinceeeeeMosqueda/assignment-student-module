import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  /**
   * Create a new student
   * @param createStudentDto - Data for creating a new student
   * @returns Newly created student
   * @throws ConflictException if email already exists
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    try {
      const student = this.studentRepository.create(createStudentDto);
      return await this.studentRepository.save(student);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  /**
   * Get all students
   * @returns Array of all students
   */
  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  /**
   * Get a specific student by ID
   * @param id - Student ID
   * @returns Student data
   * @throws NotFoundException if student doesn't exist
   */
  async findOne(id: number): Promise<Student> {
    const student = await this.studentRepository.findOne({ 
      where: { id } 
    });
    
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    
    return student;
  }
} 