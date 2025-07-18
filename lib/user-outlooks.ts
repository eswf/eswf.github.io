import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const userOutlooksDirectory = path.join(process.cwd(), 'data', 'forecasts', 'user');

export interface UserOutlook {
  id: string;
  title: string;
  threatLevel: string;
  period: string;
  mapImage?: string;
  text: string;
  contentHtml: string;
  forecaster: string;
}

export function getAllUserOutlooks(): Omit<UserOutlook, 'contentHtml'>[] {
  const fileNames = fs.readdirSync(userOutlooksDirectory);

  return fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(userOutlooksDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.name, // remap 'name' to 'title'
      threatLevel: data.threatLevel,
      period: data.period,
      mapImage: data.mapImage,
      text: content,
      forecaster: data.forecaster,
    };
  });
}

export function getUserOutlookById(id: string): UserOutlook | null {
  const fullPath = path.join(userOutlooksDirectory, `${id}.md`);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.name, // remap here as well
      threatLevel: data.threatLevel,
      period: data.period,
      mapImage: data.mapImage,
      text: content,
      contentHtml: content, // consider using remark/marked for markdown -> HTML
      forecaster: data.forecaster,
    };
  } catch {
    return null;
  }
}
