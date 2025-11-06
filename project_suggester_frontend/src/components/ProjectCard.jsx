import React from 'react';

export default function ProjectCard({ project, onRefresh }){
  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <div style={{fontWeight:700}}>{project.title}</div>
          <div className="small">{project.description}</div>
        </div>
      </div>

      {Array.isArray(project.suggestions) && project.suggestions.length > 0 && (
        <div style={{marginTop:8}}>
          <div className="small">Suggestions</div>
          {project.suggestions.slice().reverse().map((s,i) => (
            <div key={i} className="suggestion" style={{whiteSpace:'pre-wrap'}}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}
