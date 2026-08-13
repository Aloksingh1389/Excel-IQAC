// Simulated API client with slight latency to mimic real-world async data fetching
export const simulateLatency = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockResponse = async (data, delay = 80) => {
  await simulateLatency(delay);
  return { data, status: 200, success: true };
};

export const mockError = async (message = 'Operation failed', status = 400) => {
  await simulateLatency(80);
  const error = new Error(message);
  error.status = status;
  throw error;
};
