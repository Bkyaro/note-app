import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const getInitialLanguage = () => {
	const browserLang = navigator.language;
	const shortLang = browserLang.split("-")[0];

	const supportedLanguages = ["zh", "en"];
	return supportedLanguages.includes(shortLang) ? shortLang : "zh";
};

const resources = {
	en: {
		translation: {
			"note.new": "New Note",
			"note.start": "Start writing...",
			"sidebar.add": "Add New Note 📒",
			"delete.confirmTitle": "Delete Confirmation",
			"delete.confirmMessage":
				"Are you sure you want to delete this note? This action cannot be undone.",
			"export.note": "Export Notes",
			"export.csv": "Export CSV",
			"export.xml": "Export XML",
			"export.message": "Please select a format to export",
			"import.note": "Import Backup File",
			"import.message": "Please select a CSV or XML file to import",
			"select.file": "Click to select file",
			"import.success": "Import successful!",
			"delete.cancel": "Cancel",
			"delete.confirm": "Confirm",
			"edit.placeholder": "Edit note...",
			"switch.language": "Switch Language",
		},
	},
	zh: {
		translation: {
			"note.new": "新建笔记",
			"note.start": "开始记录...",
			"sidebar.add": "添加新的笔记 📒",
			"delete.confirmTitle": "删除确认",
			"delete.confirmMessage": "确定要删除这条笔记吗？此操作无法撤销。",
			"export.note": "导出笔记",
			"export.csv": "导出 CSV",
			"export.xml": "导出 XML",
			"export.message": "请选择导出格式",
			"import.note": "导入备份文件",
			"import.message": "请选择要上传的 CSV 或 XML 格式的文件",
			"select.file": "点击选择文件",
			"import.success": "导入成功！",
			"delete.cancel": "取消",
			"delete.confirm": "确认",
			"edit.placeholder": "编辑笔记...",
			"switch.language": "切换语言",
		},
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: getInitialLanguage(),
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

export const changeLanguage = (lang: string) => {
	i18n.changeLanguage(lang);
	localStorage.setItem("user-language", lang);
};

export default i18n;
