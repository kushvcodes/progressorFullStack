
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Type, Bold, Italic, List, ListOrdered, Quote, Code, Image, Link, AlignLeft } from 'lucide-react';

interface EditorButtonProps {
  icon: React.ElementType;
  tooltip: string;
}

const EditorButton: React.FC<EditorButtonProps> = ({ icon: Icon, tooltip }) => {
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8 w-8 p-0 rounded-md"
      title={tooltip}
    >
      <Icon size={16} />
    </Button>
  );
};

interface NotionLikeEditorProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const NotionLikeEditor: React.FC<NotionLikeEditorProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-1 p-1 border-b border-border mb-2 overflow-x-auto scrollbar-none">
        <EditorButton icon={Type} tooltip="Text" />
        <EditorButton icon={Bold} tooltip="Bold" />
        <EditorButton icon={Italic} tooltip="Italic" />
        <span className="h-4 border-r border-border mx-1"></span>
        <EditorButton icon={List} tooltip="Bullet List" />
        <EditorButton icon={ListOrdered} tooltip="Numbered List" />
        <span className="h-4 border-r border-border mx-1"></span>
        <EditorButton icon={Quote} tooltip="Quote" />
        <EditorButton icon={Code} tooltip="Code" />
        <span className="h-4 border-r border-border mx-1"></span>
        <EditorButton icon={Image} tooltip="Image" />
        <EditorButton icon={Link} tooltip="Link" />
        <span className="h-4 border-r border-border mx-1"></span>
        <EditorButton icon={AlignLeft} tooltip="Align" />
      </div>
      
      <Textarea 
        value={value} 
        onChange={onChange}
        placeholder="Type '/' for commands. Add your task description here..."
        className="min-h-[200px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent p-2 glass-panel"
      />
      
      <div className="text-xs text-muted-foreground flex justify-between pt-1">
        <div>Supports markdown</div>
        <div>Auto-saving...</div>
      </div>
    </div>
  );
};
