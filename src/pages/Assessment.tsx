import { ProgressAssessment } from "@/components/ProgressAssessment";
import { ComprehensiveAnalysis } from "@/components/ComprehensiveAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Assessment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="comprehensive" className="w-full">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="comprehensive">Full Analysis</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="comprehensive" className="mt-0">
          <ComprehensiveAnalysis />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-0">
          <ProgressAssessment />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assessment;