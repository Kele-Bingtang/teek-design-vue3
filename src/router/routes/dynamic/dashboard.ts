import { Odometer } from "@element-plus/icons-vue";
import { t } from "@/common/languages";

const dashboardRoutes: RouterConfigRaw = {
  path: "dashboard",
  name: "Dashboard",
  meta: {
    title: "{{ _route.Dashboard }}",
    icon: Odometer,
  },
  children: [
    {
      path: "console",
      name: "Console",
      component: "/dashboard/console/index",
      meta: {
        title: t("_route.Console"),
      },
    },
    {
      path: "analysis",
      name: "Analysis",
      component: "/dashboard/analysis/index",
      meta: {
        title: "{{ _route.Analysis }}",
      },
    },
    {
      path: "e-commerce",
      name: "ECommerce",
      component: "/dashboard/e-commerce/index",
      meta: {
        title: "电子商务",
      },
    },
  ],
};

export default dashboardRoutes;
