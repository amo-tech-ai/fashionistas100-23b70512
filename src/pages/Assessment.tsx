import { ProgressAssessment } from "@/components/ProgressAssessment";
import { ComprehensiveAnalysis } from "@/components/ComprehensiveAnalysis";
import { ProductionReadiness } from "@/components/ProductionReadiness";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Assessment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Tabs defaultValue="readiness" className="w-full">
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b">
          <div className="container mx-auto px-4 py-4">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
              <TabsTrigger value="readiness">Production Ready</TabsTrigger>
              <TabsTrigger value="comprehensive">Full Analysis</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
            </TabsList>
          </div>
        </div>
        
        <TabsContent value="readiness" className="mt-0">
          <ProductionReadiness />
        </TabsContent>
        
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