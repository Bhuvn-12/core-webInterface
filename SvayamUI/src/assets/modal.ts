export class PF {
    pf_id: string;
    env_id: string;
    pf_name: string;
    pf_desc: string;
  }

  export class PPDID {
    ppd_id: number;
  }

  export class PPD {
    ppd_id: string;
    ppd: string;
    next_ppd: string;
    valid_start_ts: string;
    valid_end_ts: string;
    sys_ts: string;
    nppd: string;
  }

  export class RUN {
    run_id: string;
    ppd: string;
    run_timestamp: string;
    run_end_timestamp: string;
    run_status: string;
  } 

  export class INT{
    id: string;
    run_id: string;
    interface: string;
    interface_file: string;
    wod: string;
    status: string;
  }

  export class BUS {
    id: string;
    run_id: string;
    bus_func_grp_cd: string;
    bus_func_cd: string;
    bus_func_step_cd: string;
    in_out_cd: string;
    in_out_res_num: string;
    in_out_res_cnt: string;
  }

  export class PPDStatus {
    ppd_id: number;
    ppd: string;
    valid_start_ts: string;
    valid_end_ts: string;
    sys_ts: string;
  }

  export class RunControl {
    run_id: string;
    run_timestamp: string;
    run_date: string;
    platform_processing_date: string;
    run_status: string;
  }

  export class InterfaceControl {
    id: string;
    source: string;
    ppd: string;
    filename: string;
    status: string;
  }

  export class OutputFiles {
    id: string;
    ppd: string;
    filename: string;
  }

  export class BusinessControl {
    bus_proc_run_id: string;
    run_id: string;
    bus_func_group_cd: string;
    bus_func_step_cd: string;
    step_data_in_out_cd: string;
    step_data_flow_dir_desc: string;
    bus_func_cnt_in: string;
    row_count: string;
  }

  export class JrnlList {
    jrnl_ln_id: string;
    jrnl_ln_desc: string;
    ldgr_type_cd: string;
    alt_org_unit_cd: string;
    prod_event_cd: string;
    txn_amt: number;
    txn_amt_type_cd: string;
    db_cr_cd: string;
    tgt_curr_cd:string;
    bus_func_cd: string;
  }
  export class ArrList {
    arr_num: string;
    arr_suf: string;
    arr_src_cd: string;
    active_dt: string;
    arr_org_cont_mat_dt: string;
    indctry_inst_rate_ex_date: string;
    balance: number;
  }
  export class TrialBal {
    lvl4_cd: string;
    lvl1_desc: string;
    lvl2_desc: string;
    lvl3_desc: string;
    lvl4_desc: string;
    balance: number;
  }
export class filterlist {
  acct_num: string;
  gaap_cd: string;
  tgt_curr_cd: string;
  tgt_curr_type_cd: string;
  acct_dt: string;
}
