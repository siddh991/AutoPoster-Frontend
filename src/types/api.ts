/**
 * API response types for the AutoPoster application
 * These types standardize the shape of API responses across the application
 */

/**
 * Standard error object returned by APIs
 */
export interface ApiError {
  message: string;           // Human-readable error message
  code?: string;             // Optional error code for programmatic handling
  status?: number;           // HTTP status code
}

/**
 * Generic API response wrapper
 * Type parameter T represents the expected data shape for a successful response
 */
export interface ApiResponse<T> {
  data?: T;                  // Response data (present on success)
  success: boolean;          // Whether the request was successful
  error?: ApiError;          // Error information (present on failure)
}

/**
 * Standard paginated response for list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];                // Array of items for current page
  total: number;             // Total number of items across all pages
  page: number;              // Current page number (1-based)
  pageSize: number;          // Number of items per page
  hasMore: boolean;          // Whether there are more pages
}

/**
 * Transforms snake_case API responses to camelCase
 * This utility helps bridge the gap between backend and frontend naming conventions
 */
// export function transformApiResponse<T>(response: Record<string, any>): T {
//   if (!response || typeof response !== 'object') {
//     return response as unknown as T;
//   }
  
//   if (Array.isArray(response)) {
//     return response.map(item => transformApiResponse<any>(item)) as unknown as T;
//   }
  
//   return Object.keys(response).reduce((result, key) => {
//     // Convert snake_case to camelCase
//     const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
//     // Transform nested objects and arrays
//     const value = response[key];
//     result[camelKey] = typeof value === 'object' ? transformApiResponse(value) : value;
    
//     return result;
//   }, {} as Record<string, any>) as T;
// }
