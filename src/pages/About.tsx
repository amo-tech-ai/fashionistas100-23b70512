import { Navigation } from "@/components/Navigation";
import { StandardCard, StandardCardContent } from "@/components/ui/StandardCard";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Calendar, Heart } from "lucide-react";
import { fashionImages } from "@/lib/cloudinary";
import Footer from "@/components/Footer";

const About = () => {
  const stats = [
    { icon: Calendar, label: "Years of Excellence", value: "15+" },
    { icon: Users, label: "Designers Featured", value: "500+" },
    { icon: Award, label: "Awards Won", value: "25+" },
    { icon: Heart, label: "Events Hosted", value: "200+" }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      {/* Hero Section with Fashion Image */}
      <div className="relative h-[500px] overflow-hidden mt-16 lg:mt-20">
        <img 
          src={fashionImages.backstage[0]} 
          alt="Fashion backstage"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <Badge variant="hero" className="mb-4 bg-white/20 backdrop-blur-sm text-white border-white/30">
              Since 2009
            </Badge>
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
              About Fashionistas
            </h1>
            <p className="text-xl max-w-3xl mx-auto text-white/90">
              We are the premier platform connecting emerging designers with fashion enthusiasts, 
              creating unforgettable experiences that celebrate creativity and innovation in fashion.
            </p>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-16">
          {stats.map((stat, index) => (
            <StandardCard key={index} className="text-center">
              <StandardCardContent className="p-4 md:p-6">
                <stat.icon className="w-8 h-8 text-brand mx-auto mb-3" />
                <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </StandardCardContent>
            </StandardCard>
          ))}
        </div>

        {/* Mission with Image */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              To democratize fashion by providing emerging designers with a global platform to showcase 
              their creativity while connecting fashion lovers with unique, cutting-edge designs.
            </p>
            <p className="text-muted-foreground mb-6">
              We believe that fashion is art, and every designer deserves the opportunity to share 
              their vision with the world. Through our events, we create spaces where innovation 
              meets appreciation, where trends are born, and where the future of fashion unfolds.
            </p>
            <div className="space-y-3">
              <Badge variant="outline" className="mr-2">Sustainability</Badge>
              <Badge variant="outline" className="mr-2">Innovation</Badge>
              <Badge variant="outline" className="mr-2">Inclusivity</Badge>
              <Badge variant="outline" className="mr-2">Creativity</Badge>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <img 
              src={fashionImages.designers[1]} 
              alt="Fashion designer at work"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Vision with Image */}
        <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
          <div className="order-2 md:order-1 relative h-[400px] rounded-lg overflow-hidden">
            <img 
              src={fashionImages.gallery[0]} 
              alt="Fashion collection"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-playfair font-bold text-foreground mb-6">Our Vision</h2>
            <p className="text-muted-foreground mb-4">
              To be the world's leading destination for discovering and experiencing the future of fashion, 
              where creativity knows no boundaries and every voice in fashion is heard.
            </p>
            <p className="text-muted-foreground mb-4">
              We envision a world where fashion is accessible, sustainable, and celebrates diversity 
              in all its forms. Where technology and tradition merge to create extraordinary experiences.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <StandardCard className="bg-brand/5">
                <StandardCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-brand">10,000+</div>
                  <div className="text-sm text-muted-foreground">Events by 2025</div>
                </StandardCardContent>
              </StandardCard>
              <StandardCard className="bg-brand/5">
                <StandardCardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-brand">100+</div>
                  <div className="text-sm text-muted-foreground">Global Cities</div>
                </StandardCardContent>
              </StandardCard>
            </div>
          </div>
        </div>

        {/* Values */}
        <StandardCard className="bg-brand/5">
          <StandardCardContent className="p-6 lg:p-8">
            <h2 className="text-3xl font-playfair font-bold text-center text-foreground mb-8">
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-brand rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair font-bold text-lg mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  We strive for excellence in every aspect of our events, from curation to execution.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-brand rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair font-bold text-lg mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Building a supportive community where designers and fashion lovers connect.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-brand rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-playfair font-bold text-lg mb-2">Passion</h3>
                <p className="text-sm text-muted-foreground">
                  Our love for fashion drives everything we do, inspiring authentic experiences.
                </p>
              </div>
            </div>
          </StandardCardContent>
        </StandardCard>
      </main>
      <Footer />
    </div>
  );
};

export default About;