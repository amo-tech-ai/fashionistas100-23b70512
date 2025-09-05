import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  FileText, Calendar, Clock, Users, CheckCircle, 
  AlertCircle, Package, Truck, Camera, Music,
  Mic, Monitor, Save, ArrowLeft, Plus, Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProductionPlanning = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Venue Setup', category: 'logistics', status: 'pending', assignee: '', deadline: '' }
  ]);
  const [formData, setFormData] = useState({
    eventName: '',
    eventId: '',
    framework: '',
    startDate: '',
    endDate: '',
    budget: '',
    teamSize: '',
    description: ''
  });

  const frameworks = [
    { id: 'fashion-show', name: 'Fashion Show', icon: '👗' },
    { id: 'product-launch', name: 'Product Launch', icon: '🚀' },
    { id: 'exhibition', name: 'Exhibition', icon: '🖼️' },
    { id: 'pop-up', name: 'Pop-up Event', icon: '🏪' },
    { id: 'workshop', name: 'Workshop', icon: '🎓' },
    { id: 'custom', name: 'Custom Plan', icon: '⚙️' }
  ];

  const taskCategories = [
    { id: 'logistics', name: 'Logistics', color: 'blue' },
    { id: 'technical', name: 'Technical', color: 'purple' },
    { id: 'creative', name: 'Creative', color: 'pink' },
    { id: 'marketing', name: 'Marketing', color: 'green' },
    { id: 'catering', name: 'Catering', color: 'orange' },
    { id: 'staffing', name: 'Staffing', color: 'yellow' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Production plan:', { ...formData, tasks });
    navigate('/admin/leap');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTask = () => {
    setTasks([...tasks, {
      id: tasks.length + 1,
      name: '',
      category: 'logistics',
      status: 'pending',
      assignee: '',
      deadline: ''
    }]);
  };

  const updateTask = (id: number, field: string, value: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="min-h-full bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin/leap')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold">Production Planning</h1>
            <p className="text-gray-600 mt-2">Create a comprehensive production plan for your event</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Event Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventName">Production Plan Name *</Label>
                    <Input
                      id="eventName"
                      placeholder="Fashion Week 2025 Production"
                      value={formData.eventName}
                      onChange={(e) => handleChange('eventName', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="eventId">Select Event *</Label>
                    <Select
                      value={formData.eventId}
                      onValueChange={(value) => handleChange('eventId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose event" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fashion-week-2025">Fashion Week 2025</SelectItem>
                        <SelectItem value="designer-showcase">Designer Showcase</SelectItem>
                        <SelectItem value="summer-collection">Summer Collection Launch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="startDate">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Start Date *
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      End Date *
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="budget">
                      Production Budget
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="50000"
                      value={formData.budget}
                      onChange={(e) => handleChange('budget', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Framework Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Production Framework</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {frameworks.map(framework => (
                    <div
                      key={framework.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all text-center ${
                        formData.framework === framework.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => handleChange('framework', framework.id)}
                    >
                      <div className="text-3xl mb-2">{framework.icon}</div>
                      <p className="font-medium text-sm">{framework.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Task Planning */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Production Tasks</span>
                  <Button
                    type="button"
                    size="sm"
                    onClick={addTask}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div key={task.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="md:col-span-2">
                          <Label>Task Name</Label>
                          <Input
                            placeholder="e.g., Stage Setup"
                            value={task.name}
                            onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={task.category}
                            onValueChange={(value) => updateTask(task.id, 'category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {taskCategories.map(cat => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Assignee</Label>
                          <Input
                            placeholder="Team member"
                            value={task.assignee}
                            onChange={(e) => updateTask(task.id, 'assignee', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Deadline</Label>
                          <Input
                            type="date"
                            value={task.deadline}
                            onChange={(e) => updateTask(task.id, 'deadline', e.target.value)}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(task.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Required Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <Camera className="h-4 w-4" />
                      <span>Photography Team</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <Monitor className="h-4 w-4" />
                      <span>Live Streaming Setup</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <Music className="h-4 w-4" />
                      <span>Sound System</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <Mic className="h-4 w-4" />
                      <span>MC/Host</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <Truck className="h-4 w-4" />
                      <span>Transportation</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="h-4 w-4" />
                      <Package className="h-4 w-4" />
                      <span>Props & Decorations</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="teamSize">Team Size</Label>
                    <Input
                      id="teamSize"
                      type="number"
                      placeholder="25"
                      value={formData.teamSize}
                      onChange={(e) => handleChange('teamSize', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Key Roles Needed</Label>
                    <div className="mt-2 space-y-2">
                      <Badge variant="outline">Production Manager</Badge>
                      <Badge variant="outline">Technical Director</Badge>
                      <Badge variant="outline">Creative Director</Badge>
                      <Badge variant="outline">Logistics Coordinator</Badge>
                      <Badge variant="outline">Stage Manager</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Production Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any special requirements, vendor notes, or important details..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Risk Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">Weather contingency plan needed</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Backup power source required</span>
                    </div>
                    <Badge className="bg-red-100 text-red-800">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Insurance coverage confirmed</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Low</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/admin/leap')}
              >
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Production Plan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductionPlanning;