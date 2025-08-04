import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { TaskFacadeService } from '../../services/task-facade.service';
import { PriorityStrategyFactory } from '../../../shared/services/priority-strategy.service';
import {
  Task,
  ICreateTaskRequest,
  TaskPriority,
} from '../../../shared/models/task.model';
import { provideZonelessChangeDetection } from '@angular/core';

describe('DashboardComponent', () => {
  // Mocks
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let mockTaskFacade: jasmine.SpyObj<TaskFacadeService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockPriorityStrategyFactory: jasmine.SpyObj<PriorityStrategyFactory>;

  // Datos de prueba
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Tarea de prueba 1',
      description: 'Descripción de prueba',
      priority: TaskPriority.HIGH,
      is_done: false,
      created_at: new Date(),
    },
    {
      id: '2',
      title: 'Tarea de prueba 2',
      description: 'Otra descripción',
      priority: TaskPriority.MEDIUM,
      is_done: true,
      created_at: new Date(),
    },
  ];

  const mockNewTask: Task = {
    id: '3',
    title: 'Nueva tarea',
    description: 'Nueva descripción',
    priority: TaskPriority.LOW,
    is_done: false,
    created_at: new Date(),
  };

  beforeEach(async () => {
    // Crear spies para los servicios mockeados
    const taskFacadeSpy = jasmine.createSpyObj('TaskFacadeService', [
      'getAllTasks',
      'createTask',
      'deleteTask',
      'toggleTaskStatus',
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const priorityStrategySpy = jasmine.createSpyObj(
      'PriorityStrategyFactory',
      ['createStrategy']
    );

    // Mock de la estrategia de prioridad
    const mockStrategy = {
      getPriorityDotClass: jasmine
        .createSpy('getPriorityDotClass')
        .and.returnValue('bg-red-500'),
    };
    priorityStrategySpy.createStrategy.and.returnValue(mockStrategy);

    // Configurar respuestas por defecto
    taskFacadeSpy.getAllTasks.and.returnValue(of(mockTasks));
    taskFacadeSpy.createTask.and.returnValue(of(mockNewTask));
    taskFacadeSpy.deleteTask.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideZonelessChangeDetection(),
        { provide: TaskFacadeService, useValue: taskFacadeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: PriorityStrategyFactory, useValue: priorityStrategySpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    mockTaskFacade = TestBed.inject(
      TaskFacadeService
    ) as jasmine.SpyObj<TaskFacadeService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockPriorityStrategyFactory = TestBed.inject(
      PriorityStrategyFactory
    ) as jasmine.SpyObj<PriorityStrategyFactory>;

    fixture.detectChanges();
  });

  describe('Botón de agregar tarea', () => {
    it('debería abrir el diálogo cuando se hace clic en el botón "Nueva"', () => {
      // Arrange - Estado inicial
      expect(component.showDialog()).toBeFalse();
      expect(component.editingTask()).toBeNull();

      // Act - Simular clic en el botón de nueva tarea
      component.openDialog();

      // Assert - Verificar que el diálogo se abre correctamente
      expect(component.showDialog()).toBeTrue();
      expect(component.editingTask()).toBeNull(); // Debe estar en modo creación, no edición
    });

    it('debería crear una nueva tarea cuando se envía el formulario del diálogo', () => {
      // Arrange
      const taskData: ICreateTaskRequest = {
        title: 'Nueva tarea desde test',
        description: 'Descripción de test',
        priority: TaskPriority.HIGH,
      };

      const tasksBeforeCreation = component.tasks().length;

      // Act - Simular la creación de una tarea
      component.handleTaskAction(taskData);

      // Assert - Verificar que se llamó al servicio y se actualizó la lista
      expect(mockTaskFacade.createTask).toHaveBeenCalledWith(taskData);
      expect(mockTaskFacade.createTask).toHaveBeenCalledTimes(1);

      // Verificar que la nueva tarea se agregó al inicio de la lista
      expect(component.tasks().length).toBe(tasksBeforeCreation + 1);
      expect(component.tasks()[0]).toEqual(mockNewTask);

      // Verificar que el diálogo se cierra después de crear la tarea
      expect(component.showDialog()).toBeFalse();
    });

    it('debería manejar errores al crear una tarea', () => {
      // Arrange
      const taskData: ICreateTaskRequest = {
        title: 'Tarea con error',
        description: 'Esta tarea fallará',
        priority: TaskPriority.MEDIUM,
      };

      const errorMessage = 'Error al crear la tarea';

      // Mock console.error para evitar ruido en los tests
      spyOn(console, 'error');

      mockTaskFacade.createTask.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      // Act
      component.handleTaskAction(taskData);

      // Assert
      expect(mockTaskFacade.createTask).toHaveBeenCalledWith(taskData);
      expect(component.errorMessage()).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith(
        'Error al crear la tarea:',
        jasmine.any(Error)
      );
    });
  });

  describe('Botón de eliminar tarea', () => {
    beforeEach(() => {
      // Mock de la función confirm del navegador
      spyOn(window, 'confirm');
    });

    it('debería eliminar una tarea cuando el usuario confirma la eliminación', () => {
      // Arrange
      const taskIdToDelete = '1';
      const tasksBeforeDeletion = component.tasks().length;

      // Simular que el usuario confirma la eliminación
      (window.confirm as jasmine.Spy).and.returnValue(true);

      // Act - Simular clic en el botón de eliminar
      component.deleteTask(taskIdToDelete);

      // Assert - Verificar que se mostró la confirmación
      expect(window.confirm).toHaveBeenCalledWith(
        '¿Estás seguro de que quieres eliminar esta tarea?'
      );

      // Verificar que se llamó al servicio de eliminación
      expect(mockTaskFacade.deleteTask).toHaveBeenCalledWith(taskIdToDelete);
      expect(mockTaskFacade.deleteTask).toHaveBeenCalledTimes(1);

      // Verificar que la tarea se eliminó de la lista local
      expect(component.tasks().length).toBe(tasksBeforeDeletion - 1);
      expect(
        component.tasks().find((task) => task.id === taskIdToDelete)
      ).toBeUndefined();
    });

    it('NO debería eliminar una tarea cuando el usuario cancela la confirmación', () => {
      // Arrange
      const taskIdToDelete = '1';
      const tasksBeforeDeletion = component.tasks().length;

      // Simular que el usuario cancela la eliminación
      (window.confirm as jasmine.Spy).and.returnValue(false);

      // Act - Simular clic en el botón de eliminar
      component.deleteTask(taskIdToDelete);

      // Assert - Verificar que se mostró la confirmación
      expect(window.confirm).toHaveBeenCalledWith(
        '¿Estás seguro de que quieres eliminar esta tarea?'
      );

      // Verificar que NO se llamó al servicio de eliminación
      expect(mockTaskFacade.deleteTask).not.toHaveBeenCalled();

      // Verificar que la lista de tareas permanece igual
      expect(component.tasks().length).toBe(tasksBeforeDeletion);
      expect(
        component.tasks().find((task) => task.id === taskIdToDelete)
      ).toBeDefined();
    });

    it('debería manejar errores al eliminar una tarea', () => {
      // Arrange
      const taskIdToDelete = '1';
      const errorMessage = 'Error al eliminar la tarea';

      // Mock console.error para evitar ruido en los tests
      spyOn(console, 'error');

      (window.confirm as jasmine.Spy).and.returnValue(true);
      mockTaskFacade.deleteTask.and.returnValue(
        throwError(() => new Error(errorMessage))
      );

      // Act
      component.deleteTask(taskIdToDelete);

      // Assert
      expect(mockTaskFacade.deleteTask).toHaveBeenCalledWith(taskIdToDelete);
      expect(component.errorMessage()).toBe(errorMessage);
      expect(console.error).toHaveBeenCalledWith(
        'Error al eliminar la tarea:',
        jasmine.any(Error)
      );
    });
  });
});
