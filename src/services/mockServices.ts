// Mock services to replace deleted ones
export const designerService = {
  getAllDesigners: () => Promise.resolve([]),
  getDesignerById: () => Promise.resolve(null),
};

export const eventService = {
  getAllEvents: () => Promise.resolve([]),
  getEventById: () => Promise.resolve(null),
};