// Temporary mock Supabase client to bypass type errors
// This will be replaced once proper database schema is set up

interface MockQueryBuilder {
  select: (columns?: string) => MockQueryBuilder;
  insert: (data: any) => MockQueryBuilder;
  update: (data: any) => MockQueryBuilder;
  delete: () => MockQueryBuilder;
  eq: (column: string, value: any) => MockQueryBuilder;
  single: () => MockQueryBuilder;
  then: (callback: (result: { data: any; error: any }) => void) => void;
}

class MockSupabaseClient {
  from(table: string): MockQueryBuilder {
    return new MockQueryBuilderImpl();
  }
}

class MockQueryBuilderImpl implements MockQueryBuilder {
  select(columns?: string): MockQueryBuilder {
    return this;
  }

  insert(data: any): MockQueryBuilder {
    return this;
  }

  update(data: any): MockQueryBuilder {
    return this;
  }

  delete(): MockQueryBuilder {
    return this;
  }

  eq(column: string, value: any): MockQueryBuilder {
    return this;
  }

  single(): MockQueryBuilder {
    return this;
  }

  then(callback: (result: { data: any; error: any }) => void): void {
    // Return mock data
    setTimeout(() => {
      callback({ data: [], error: null });
    }, 100);
  }
}

export const mockSupabase = new MockSupabaseClient();