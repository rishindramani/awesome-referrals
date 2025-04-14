import { renderHook, act } from '@testing-library/react-hooks';
import useForm from '../useForm';

describe('useForm Hook', () => {
  const initialValues = {
    name: 'John',
    email: 'john@example.com'
  };
  
  const mockOnSubmit = jest.fn();
  const mockValidate = jest.fn(() => ({}));
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('should initialize with the initial values', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit, mockValidate));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });
  
  test('should handle input changes correctly', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit, mockValidate));
    
    // Simulate an input change event
    const event = {
      target: {
        name: 'email',
        value: 'newemail@example.com'
      }
    };
    
    act(() => {
      result.current.handleChange(event);
    });
    
    // Check if the values were updated correctly
    expect(result.current.values).toEqual({
      ...initialValues,
      email: 'newemail@example.com'
    });
  });
  
  test('should handle checkbox input changes correctly', () => {
    const { result } = renderHook(() => useForm(
      { ...initialValues, isSubscribed: false },
      mockOnSubmit,
      mockValidate
    ));
    
    // Simulate a checkbox change event
    const event = {
      target: {
        name: 'isSubscribed',
        type: 'checkbox',
        checked: true
      }
    };
    
    act(() => {
      result.current.handleChange(event);
    });
    
    // Check if the values were updated correctly
    expect(result.current.values.isSubscribed).toBe(true);
  });
  
  test('should handle field blur correctly', () => {
    const mockValidateWithError = jest.fn(() => ({
      email: 'Invalid email'
    }));
    
    const { result } = renderHook(() => 
      useForm(initialValues, mockOnSubmit, mockValidateWithError)
    );
    
    // Simulate a blur event
    const event = {
      target: {
        name: 'email'
      }
    };
    
    act(() => {
      result.current.handleBlur(event);
    });
    
    // Check if touched and errors were updated correctly
    expect(result.current.touched).toEqual({ email: true });
    expect(result.current.errors).toEqual({ email: 'Invalid email' });
    expect(mockValidateWithError).toHaveBeenCalledWith(initialValues);
  });
  
  test('should handle form submission correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useForm(initialValues, mockOnSubmit, mockValidate)
    );
    
    // Mock event for the form submission
    const event = {
      preventDefault: jest.fn()
    };
    
    await act(async () => {
      result.current.handleSubmit(event);
      await waitForNextUpdate();
    });
    
    // Check if all fields were marked as touched
    expect(result.current.touched).toEqual({
      name: true,
      email: true
    });
    
    // Check if the onSubmit callback was called with correct values
    expect(mockOnSubmit).toHaveBeenCalledWith(initialValues);
    expect(event.preventDefault).toHaveBeenCalled();
  });
  
  test('should not submit if validation fails', async () => {
    const mockValidateWithErrors = jest.fn(() => ({
      email: 'Invalid email'
    }));
    
    const { result } = renderHook(() => 
      useForm(initialValues, mockOnSubmit, mockValidateWithErrors)
    );
    
    const event = {
      preventDefault: jest.fn()
    };
    
    act(() => {
      result.current.handleSubmit(event);
    });
    
    // Check if all fields were marked as touched
    expect(result.current.touched).toEqual({
      name: true,
      email: true
    });
    
    // Check if errors were set correctly
    expect(result.current.errors).toEqual({
      email: 'Invalid email'
    });
    
    // Check that the onSubmit callback was NOT called
    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });
  
  test('should reset form to initial values', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit, mockValidate));
    
    // Change some values first
    act(() => {
      result.current.handleChange({
        target: {
          name: 'email',
          value: 'newemail@example.com'
        }
      });
      
      result.current.handleBlur({
        target: {
          name: 'email'
        }
      });
    });
    
    // Reset the form
    act(() => {
      result.current.resetForm();
    });
    
    // Check if the form was reset correctly
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });
  
  test('should set form values programmatically', () => {
    const { result } = renderHook(() => useForm(initialValues, mockOnSubmit, mockValidate));
    
    // Set new values programmatically
    act(() => {
      result.current.setFormValues({
        name: 'Jane',
        age: 30 // Adding a new field
      });
    });
    
    // Check if the values were updated correctly
    expect(result.current.values).toEqual({
      ...initialValues,
      name: 'Jane',
      age: 30
    });
  });
}); 