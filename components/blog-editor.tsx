"use client";

import { Button } from "@/components/ui/button";
import { Edit, Eye, Globe, Languages, Plus, Send } from "lucide-react";
import { useState } from "react";
import { BlogPreview } from "./blog-preview";
import { LanguageManager } from "./language-manager";
import { PublishModal } from "./publish-modal";
import { Section } from "./section";

export interface Block {
  id: string;
  type: "text" | "image" | "embed";
  content: any;
}

export interface Column {
  id: string;
  blocks: Block[];
}

export interface SectionData {
  id: string;
  columns: Column[];
}

export interface LanguageVersion {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  sections: SectionData[];
  isDefault?: boolean;
}

const initialSections: SectionData[] = [
  {
    id: "section-1",
    columns: [
      {
        id: "col-1",
        blocks: [
          {
            id: "block-1",
            type: "text",
            content: {
              html: "<p>Vườn Quốc gia Du Già là một kho tàng đa dạng sinh học vô cùng phong phú với 318 loài động vật có xương sống trên cạn, gồm 72 loài thú, 162 loài chim, 84 loài bò sát và lưỡng cư. Đây là ngôi nhà của nhiều loài quý hiếm, đặc hữu và có tên trong Sách Đỏ, đặc biệt loài Voọc mũi hếch - một trong 25 loài linh trưởng đang bị đe dọa tuyệt chủng cao nhất trên thế giới hiện nay.</p>",
            },
          },
        ],
      },
    ],
  },
  {
    id: "section-1753176792856",
    columns: [
      {
        id: "col-1753176792856",
        blocks: [
          {
            id: "block-1753176801674",
            type: "text",
            content: {
              html: "<h1>01. Voọc mũi hếch</h1><p></p>",
            },
          },
        ],
      },
    ],
  },
  {
    id: "section-1753176887094",
    columns: [
      {
        id: "col-1753176887094",
        blocks: [
          {
            id: "block-1753176915774",
            type: "text",
            content: {
              html: "<p><strong>Tên khoa học: Rhinopithecus avunculus</strong></p><p></p><p>Voọc mũi hếch, một loài linh trưởng đặc biệt, sống chủ yếu ở trên cây tại vùng núi cao rừng nhiệt đới. Vườn Quốc gia Du Già là môi trường lý tưởng của chúng, và chiếc mũi hếch đặc trưng đã làm cho chúng trở thành biểu tượng của khu rừng nhiệt đới. Chúng thường tập trung thành bầy đàn và chia thành các nhóm nhỏ dưới sự lãnh đạo của một con đực trưởng thành.Start writing...</p>",
            },
          },
        ],
      },
      {
        id: "col-1753176894569",
        blocks: [
          {
            id: "block-1753176941060",
            type: "image",
            content: {
              src: "https://firebasestorage.googleapis.com/v0/b/introduction-national-forests.appspot.com/o/national_forests%2Fanimal%2F1%2Fd24d27fae238bcb8c3bf690dacd8f608.jpg?alt=media&token=578b970a-8ec1-41d8-820b-868eee40145e",
              alt: "abc",
              caption: "Nguồn ABC",
            },
          },
        ],
      },
    ],
  },
  {
    id: "section-1753177035890",
    columns: [
      {
        id: "col-1753177035890",
        blocks: [
          {
            id: "block-1753177038504",
            type: "text",
            content: {
              html: "<p>Voọc mũi hếch là loài đặc hữu hẹp, chỉ phân bố ở một số tỉnh thuộc Đông Bắc Việt Nam. Hiện tại, quần thể Voọc mũi hếch có khoảng 108 - 113 cá thể, chiếm gần 50% tổng số cá thể Voọc mũi hếch hiện nay ở Việt Nam. Do số lượng giảm sút đáng kể, Voọc mũi hếch hiện đang được bảo vệ và đưa vào Sách Đỏ. Việc bảo tồn loài linh trưởng quý hiếm này không chỉ góp phần bảo vệ đa dạng sinh học mà còn giữ gìn vẻ đẹp tự nhiên của các khu rừng nhiệt đới.</p>",
            },
          },
        ],
      },
    ],
  },
  {
    id: "section-1753177076369",
    columns: [
      {
        id: "col-1753177076369",
        blocks: [
          {
            id: "block-1753177100181",
            type: "image",
            content: {
              src: "https://firebasestorage.googleapis.com/v0/b/introduction-national-forests.appspot.com/o/national_forests%2Fanimal%2F1%2F247a9324ea8937dd0115c3623023ec4e.jpg?alt=media&token=ae63a778-1397-4a67-9e32-200546c05add",
              alt: "",
              caption: "Nguồn ABC",
            },
          },
        ],
      },
      {
        id: "col-1753177078541",
        blocks: [
          {
            id: "block-1753177122184",
            type: "image",
            content: {
              src: "https://firebasestorage.googleapis.com/v0/b/introduction-national-forests.appspot.com/o/national_forests%2Fanimal%2F1%2Ffecae71832deef95ea945b0bc790bf7a.jpg?alt=media&token=66f85b18-78d6-4b6e-a360-df179281cf15",
              alt: "",
              caption: "Nguồn ABC",
            },
          },
        ],
      },
    ],
  },
  {
    id: "section-1753177994908",
    columns: [
      {
        id: "col-1753177994908",
        blocks: [
          {
            id: "block-1753177997771",
            type: "embed",
            content: {
              title: "Embed Content",
              iframe:
                '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.0707847893914!2d105.3626985!3d21.0812013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313461542bb47287%3A0xfc1784f698c57611!2zVsaw4budbiBRdeG7kWMgZ2lhIEJhIFbDrA!5e1!3m2!1svi!2s!4v1753178005407!5m2!1svi!2s" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
              url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.0707847893914!2d105.3626985!3d21.0812013!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313461542bb47287%3A0xfc1784f698c57611!2zVsaw4budbiBRdeG7kWMgZ2lhIEJhIFbDrA!5e1!3m2!1svi!2s!4v1753178005407!5m2!1svi!2s",
            },
          },
        ],
      },
    ],
  },
];

const defaultLanguages: LanguageVersion[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    sections: initialSections,
    isDefault: true,
  },
];

export function BlogEditor() {
  const [languages, setLanguages] =
    useState<LanguageVersion[]>(defaultLanguages);
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [previewLanguage, setPreviewLanguage] = useState<string>("en");
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showLanguageManager, setShowLanguageManager] = useState(false);

  const getCurrentLanguageData = () => {
    return (
      languages.find((lang) => lang.code === currentLanguage) || languages[0]
    );
  };

  const getPreviewLanguageData = () => {
    return (
      languages.find((lang) => lang.code === previewLanguage) || languages[0]
    );
  };

  const getCurrentSections = () => {
    return getCurrentLanguageData().sections;
  };

  const getPreviewSections = () => {
    return getPreviewLanguageData().sections;
  };

  const addSection = () => {
    const newSection: SectionData = {
      id: `section-${Date.now()}`,
      columns: [
        {
          id: `col-${Date.now()}`,
          blocks: [],
        },
      ],
    };

    setLanguages((prev) =>
      prev.map((lang) =>
        lang.code === currentLanguage
          ? { ...lang, sections: [...lang.sections, newSection] }
          : lang
      )
    );
  };

  const updateSection = (sectionId: string, updatedSection: SectionData) => {
    setLanguages((prev) =>
      prev.map((lang) =>
        lang.code === currentLanguage
          ? {
              ...lang,
              sections: lang.sections.map((section) =>
                section.id === sectionId ? updatedSection : section
              ),
            }
          : lang
      )
    );
  };

  const deleteSection = (sectionId: string) => {
    setLanguages((prev) =>
      prev.map((lang) =>
        lang.code === currentLanguage
          ? {
              ...lang,
              sections: lang.sections.filter(
                (section) => section.id !== sectionId
              ),
            }
          : lang
      )
    );
  };

  const handlePublish = async (metadata: any) => {
    const blogData = {
      ...metadata,
      languages: languages.map((lang) => ({
        ...lang,
        wordCount: calculateWordCount(lang.sections),
      })),
      currentLanguage,
      publishedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Blog published successfully! ID: ${result.id}`);
        setIsPublishModalOpen(false);
      } else {
        throw new Error("Failed to publish");
      }
    } catch (error) {
      console.error("Publish error:", error);
      alert("Failed to publish blog. Please try again.");
    }
  };

  const calculateWordCount = (sections: SectionData[]) => {
    let wordCount = 0;
    sections.forEach((section) => {
      section.columns.forEach((column) => {
        column.blocks.forEach((block) => {
          if (block.type === "text" && block.content.html) {
            const text = block.content.html.replace(/<[^>]*>/g, "");
            wordCount += text
              .split(/\s+/)
              .filter((word: string) => word.length > 0).length;
          }
        });
      });
    });
    return wordCount;
  };

  const addLanguageVersion = (newLanguage: LanguageVersion) => {
    setLanguages((prev) => [...prev, newLanguage]);
  };

  const updateLanguageVersion = (
    code: string,
    updatedLanguage: LanguageVersion
  ) => {
    setLanguages((prev) =>
      prev.map((lang) => (lang.code === code ? updatedLanguage : lang))
    );
  };

  const deleteLanguageVersion = (code: string) => {
    if (languages.length <= 1) return; // Don't delete the last language

    setLanguages((prev) => prev.filter((lang) => lang.code !== code));

    // Switch to first available language if current is deleted
    if (currentLanguage === code) {
      const remainingLanguages = languages.filter((lang) => lang.code !== code);
      setCurrentLanguage(remainingLanguages[0]?.code || "en");
    }

    // Switch preview language if deleted
    if (previewLanguage === code) {
      const remainingLanguages = languages.filter((lang) => lang.code !== code);
      setPreviewLanguage(remainingLanguages[0]?.code || "en");
    }
  };

  const duplicateToLanguage = (targetLanguageCode: string) => {
    const currentSections = getCurrentSections();
    setLanguages((prev) =>
      prev.map((lang) =>
        lang.code === targetLanguageCode
          ? { ...lang, sections: JSON.parse(JSON.stringify(currentSections)) }
          : lang
      )
    );
  };

  const currentSections = getCurrentSections();
  const currentLangData = getCurrentLanguageData();
  const previewSections = getPreviewSections();
  const previewLangData = getPreviewLanguageData();

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm border">
      {/* Tab Navigation */}
      <div className="border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Button
                onClick={() => setIsPreviewMode(false)}
                variant={!isPreviewMode ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Editor
              </Button>
              <Button
                onClick={() => setIsPreviewMode(true)}
                variant={isPreviewMode ? "default" : "ghost"}
                size="sm"
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2 pl-4 border-l">
              <Globe className="w-4 h-4 text-gray-500" />
              <select
                value={isPreviewMode ? previewLanguage : currentLanguage}
                onChange={(e) => {
                  if (isPreviewMode) {
                    setPreviewLanguage(e.target.value);
                  } else {
                    setCurrentLanguage(e.target.value);
                  }
                }}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
              {!isPreviewMode && (
                <Button
                  onClick={() => setShowLanguageManager(true)}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Languages className="w-4 h-4" />
                  Manage Languages
                </Button>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            {isPreviewMode ? (
              <>
                {previewSections.length} section
                {previewSections.length !== 1 ? "s" : ""} •{" "}
                {calculateWordCount(previewSections)} words
              </>
            ) : (
              <>
                {currentSections.length} section
                {currentSections.length !== 1 ? "s" : ""} •{" "}
                {calculateWordCount(currentSections)} words
              </>
            )}
            {languages.length > 1 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {languages.length} languages
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {isPreviewMode ? (
          <div className="space-y-4">
            {/* Preview Language Indicator */}
            {languages.length > 1 && (
              <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{previewLangData.flag}</span>
                  <div className="text-center">
                    <div className="font-medium text-green-900">
                      Previewing: {previewLangData.name} (
                      {previewLangData.nativeName})
                    </div>
                    <div className="text-sm text-green-700">
                      {calculateWordCount(previewSections)} words •{" "}
                      {previewSections.length} sections
                    </div>
                  </div>
                </div>
              </div>
            )}
            <BlogPreview sections={previewSections} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Language Indicator */}
            {languages.length > 1 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{currentLangData.flag}</span>
                  <div>
                    <div className="font-medium text-blue-900">
                      Editing: {currentLangData.name} (
                      {currentLangData.nativeName})
                    </div>
                    <div className="text-sm text-blue-700">
                      {currentLangData.isDefault && "Default language"} •{" "}
                      {calculateWordCount(currentSections)} words
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {languages.length > 1 && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          duplicateToLanguage(e.target.value);
                          alert(
                            `Content copied to ${
                              languages.find((l) => l.code === e.target.value)
                                ?.name
                            }!`
                          );
                        }
                      }}
                      value=""
                      className="px-3 py-1 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">Copy content to...</option>
                      {languages
                        .filter((lang) => lang.code !== currentLanguage)
                        .map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.flag} {lang.name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </div>
            )}

            {currentSections.map((section) => (
              <Section
                key={section.id}
                section={section}
                onUpdate={updateSection}
                onDelete={deleteSection}
              />
            ))}

            <div className="flex justify-center pt-4">
              <Button
                onClick={addSection}
                variant="outline"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 border-dashed border-2 px-6 py-3 bg-transparent"
              >
                <Plus className="w-4 h-4" />
                Add Section
              </Button>
            </div>
          </div>
        )}

        {!isPreviewMode && (
          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-sm text-gray-500">
              {currentSections.length} section
              {currentSections.length !== 1 ? "s" : ""} •{" "}
              {calculateWordCount(currentSections)} words
              {languages.length > 1 && (
                <span className="ml-2">
                  • {languages.length} language
                  {languages.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <Button
              onClick={() => setIsPublishModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
              Publish Blog
            </Button>
          </div>
        )}

        <PublishModal
          isOpen={isPublishModalOpen}
          onClose={() => setIsPublishModalOpen(false)}
          onPublish={handlePublish}
          sections={currentSections}
          languages={languages}
        />

        <LanguageManager
          isOpen={showLanguageManager}
          onClose={() => setShowLanguageManager(false)}
          languages={languages}
          currentLanguage={currentLanguage}
          onAddLanguage={addLanguageVersion}
          onUpdateLanguage={updateLanguageVersion}
          onDeleteLanguage={deleteLanguageVersion}
          onSwitchLanguage={setCurrentLanguage}
        />
      </div>
    </div>
  );
}
