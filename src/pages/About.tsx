import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Calendar, Heart } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Calendar, label: "Years of Excellence", value: "15+" },
    { icon: Users, label: "Designers Featured", value: "500+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: Heart, label: "Events Hosted", value: "200+" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16 lg:pt-20 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold text-foreground mb-6">
            About Fashionistas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We are the premier platform connecting emerging designers with fashion enthusiasts, 
            creating unforgettable experiences that celebrate creativity and innovation in fashion.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              To democratize fashion by providing emerging designers with a global platform to showcase 
              their creativity while connecting fashion lovers with unique, cutting-edge designs.
            </p>
            <p className="text-muted-foreground">
              We believe that fashion is art, and every designer deserves the opportunity to share 
              their vision with the world. Through our events, we create spaces where innovation 
              meets appreciation, where trends are born, and where the future of fashion unfolds.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">Our Vision</h2>
            <p className="text-muted-foreground mb-4">
              To be the world's leading destination for discovering and experiencing the future of fashion, 
              where creativity knows no boundaries and every voice in fashion is heard.
            </p>
            <div className="space-y-3">
              <Badge variant="outline" className="mr-2">Sustainability</Badge>
              <Badge variant="outline" className="mr-2">Innovation</Badge>
              <Badge variant="outline" className="mr-2">Inclusivity</Badge>
              <Badge variant="outline" className="mr-2">Creativity</Badge>
            </div>
          </div>
        </div>

        {/* Values */}
        <Card className="bg-accent/5">
          <CardContent className="p-8">
            <h2 className="text-3xl font-playfair font-bold text-center text-foreground mb-8">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair font-bold text-lg mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  We strive for excellence in every aspect of our events, from curation to execution.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair font-bold text-lg mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Building a supportive community where designers and fashion lovers connect.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-accent rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair font-bold text-lg mb-2">Passion</h3>
                <p className="text-sm text-muted-foreground">
                  Our love for fashion drives everything we do, inspiring authentic experiences.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default About;