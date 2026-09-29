function norm(p){ return String(p||'').replace(/^\.\//,'').replace(/^\//,''); }
function candidates(sourceFile){
  const s=norm(sourceFile);
  const out=new Set([s]);
  if(s.startsWith('sources/')||s.startsWith('src/')||s.startsWith('tests/')||s.startsWith('scripts/')){
    out.add('cloud/n04-r38-library/'+s);
  }
  return [...out];
}
function routeFilePrefixes(route){
  const r=String(route||'').trim();
  if(!r) return [];
  if(r==='/') return ['index.html'];
  const p=norm(r);
  if(!p) return [];
  return [p];
}
function pathMatches(path,domain){
  const p=norm(path);
  for(const sf of domain.source_files||[]){
    if(candidates(sf).includes(p)) return {matched:true,reason:'SOURCE_FILE',source:sf};
  }
  for(const rp of domain.route_prefixes||[]){
    for(const prefix of routeFilePrefixes(rp)){
      if(prefix==='index.html'&&p==='index.html') return {matched:true,reason:'ROUTE_FILE',source:rp};
      if(prefix!=='index.html'&&p.startsWith(prefix)) return {matched:true,reason:'ROUTE_FILE',source:rp};
    }
  }
  return {matched:false};
}

export function planIncrementalImpact(registry,changedPaths){
  if(registry?.schema!=='R51_A9_LIBRARY_SOURCE_REGISTRY/1.0') throw new Error('invalid_source_registry');
  const paths=[...new Set((changedPaths||[]).map(norm).filter(Boolean))].sort();
  const affected=new Map();
  const matchedPaths=new Set();

  for(const dep of registry.global_dependencies||[]){
    const triggers=(dep.paths||[]).map(norm);
    const hits=paths.filter(p=>triggers.includes(p));
    if(!hits.length) continue;
    for(const domainName of dep.domains||[]){
      const domain=registry.domains.find(d=>d.domain===domainName);
      if(!domain) throw new Error('unknown_global_dependency_domain:'+domainName);
      if(!affected.has(domainName)) affected.set(domainName,[]);
      for(const p of hits){
        affected.get(domainName).push({path:p,reason:dep.reason||'GLOBAL_DEPENDENCY'});
        matchedPaths.add(p);
      }
    }
  }

  for(const domain of registry.domains){
    for(const p of paths){
      const m=pathMatches(p,domain);
      if(!m.matched) continue;
      if(!affected.has(domain.domain)) affected.set(domain.domain,[]);
      affected.get(domain.domain).push({path:p,reason:m.reason,source:m.source});
      matchedPaths.add(p);
    }
  }

  const affectedDomains=[...affected.keys()].sort();
  const ignoredPaths=paths.filter(p=>!matchedPaths.has(p));
  return {
    schema:'R51_A9_INCREMENTAL_IMPACT_PLAN/1.0',
    changed_paths:paths,
    affected_domains:affectedDomains,
    reasons:Object.fromEntries([...affected.entries()].sort(([a],[b])=>a.localeCompare(b))),
    ignored_paths:ignoredPaths,
    status:affectedDomains.length?'CONTENT_CHANGE':'NO_CONTENT_CHANGE',
    rebuild_required:affectedDomains.length>0
  };
}
