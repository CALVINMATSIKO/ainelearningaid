import { ApiResponse, Question, Answer } from '../../../shared/types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
console.log('API_BASE_URL:', API_BASE_URL);

class ApiService {
  private getSessionId(): string {
    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('session_id', sessionId);
    }
    return sessionId;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': this.getSessionId(),
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Store session_id if provided
      const newSessionId = response.headers.get('x-session-id');
      if (newSessionId) {
        localStorage.setItem('session_id', newSessionId);
      }

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Question endpoints
  async submitQuestion(questionData: {
    content: string;
    subject: string;
    question_type: string;
    grade_level: string;
    competencies?: string[];
    context?: string;
  }): Promise<{ question: Question; answer: Answer; analysis: any; competency_check: any }> {
    const body = {
      question: questionData.content,
      subject: questionData.subject,
      grade_level: questionData.grade_level,
      context: questionData.context,
    };
    console.log('Submitting question:', body);
    const response = await this.request<{ question: Question; answer: Answer; analysis: any; competency_check: any }>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    console.log('API response:', response);
    return response.data!;
  }

  async getQuestionHistory(limit = 10): Promise<Question[]> {
    const response = await this.request<Question[]>(`/questions?limit=${limit}`);
    return response.data || [];
  }

  // Answer endpoints
  async getAnswer(questionId: number): Promise<Answer> {
    const response = await this.request<Answer>(`/answers/${questionId}`);
    return response.data!;
  }

  async getRecentAnswers(limit = 5): Promise<Answer[]> {
    const response = await this.request<Answer[]>(`/answers/recent?limit=${limit}`);
    return response.data || [];
  }

  // Competency endpoints
  async getCompetencyProgress(): Promise<Record<string, number>> {
    const response = await this.request<Record<string, number>>('/competencies/progress');
    return response.data || {};
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.data!;
  }

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
    grade_level: string;
    subjects?: string[];
  }): Promise<{ token: string; user: any }> {
    const response = await this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return response.data!;
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.request<any>('/auth/me', { method: 'GET' });
    return response.data!;
  }

  // Generic GET method
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint);
    return response.data!;
  }

  async updateProfile(updates: any): Promise<any> {
    const response = await this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data!;
  }

  // Image generation endpoints
  async generateImage(data: {
    prompt: string;
    subject: string;
  }): Promise<{
    imageUrl: string;
    revisedPrompt: string;
    processingTime: number;
    model: string;
    size: string;
    costEstimate: number;
    usageCount: number;
    createdAt: string;
  }> {
    const response = await this.request<{
      imageUrl: string;
      revisedPrompt: string;
      processingTime: number;
      model: string;
      size: string;
      costEstimate: number;
      usageCount: number;
      createdAt: string;
    }>('/images/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.data!;
  }
}

export const apiService = new ApiService();
export default apiService;