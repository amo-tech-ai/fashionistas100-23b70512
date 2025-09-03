import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/Navigation'
import { Users, Palette, Calendar, Building2 } from 'lucide-react'

export default function Onboarding() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    role: 'fashion_enthusiast',
    company: '',
    brand: '',
    bio: '',
    interests: [] as string[]
  })
  
  const roles = [
    {
      id: 'fashion_enthusiast',
      title: 'Fashion Enthusiast',
      description: 'Discover and attend exclusive fashion events',
      icon: Users
    },
    {
      id: 'designer',
      title: 'Designer',
      description: 'Showcase your collections and connect with industry',
      icon: Palette
    },
    {
      id: 'event_organizer',
      title: 'Event Organizer',
      description: 'Create and manage fashion events and shows',
      icon: Calendar
    },
    {
      id: 'venue_owner',
      title: 'Venue Owner',
      description: 'List your space for fashion events and shows',
      icon: Building2
    }
  ]
  
  const interests = [
    'Runway Shows', 'Designer Showcases', 'Fashion Weeks', 'Pop-up Events',
    'Sustainable Fashion', 'Haute Couture', 'Street Style', 'Fashion Photography',
    'Networking Events', 'Fashion Tech', 'Vintage Fashion', 'Emerging Designers'
  ]
  
  const handleRoleSelect = (roleId: string) => {
    setFormData({ ...formData, role: roleId })
    setStep(2)
  }
  
  const handleInterestToggle = (interest: string) => {
    const newInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest]
    setFormData({ ...formData, interests: newInterests })
  }
  
  const handleComplete = async () => {
    try {
      await user?.update({
        unsafeMetadata: formData
      })
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to update user metadata:', error)
    }
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-playfair font-bold text-foreground mb-2">
              Welcome to Fashionistas
            </h1>
            <p className="text-muted-foreground">
              Let's personalize your experience
            </p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
              </div>
            </div>
          </div>
          
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>What brings you to Fashionistas?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map(role => {
                    const Icon = role.icon
                    return (
                      <div
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className="p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className="w-6 h-6 text-primary mt-1" />
                          <div>
                            <h3 className="font-medium mb-1">{role.title}</h3>
                            <p className="text-sm text-muted-foreground">{role.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
          
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Tell us more about yourself</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(formData.role === 'event_organizer' || formData.role === 'venue_owner') && (
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your company or organization"
                    />
                  </div>
                )}
                
                {formData.role === 'designer' && (
                  <div>
                    <Label htmlFor="brand">Brand Name</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Your fashion brand"
                    />
                  </div>
                )}
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself and your fashion interests"
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={() => setStep(3)}>
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>What interests you most?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">Select all that apply:</p>
                  <div className="flex flex-wrap gap-2">
                    {interests.map(interest => (
                      <Badge
                        key={interest}
                        variant={formData.interests.includes(interest) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleInterestToggle(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button onClick={handleComplete}>
                      Complete Setup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}